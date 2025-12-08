import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useLoanStore = defineStore('loans', () => {
  const loans = ref([])
  
  // 1. The Multi-Factor State
  const factors = ref({
    interestRate: 0,   // EURIBOR/SOFR Hike (0-10%)
    inflation: 2,      // Inflation Rate (Baseline 2%)
    gdpGrowth: 2,      // GDP Growth (Baseline 2%)
    revenueShock: 0,   // Global Sales Drop (0-30%)
  })

  const fetchLoans = async () => {
    try {
      loans.value = await window.api.getPortfolio()
    } catch (err) {
      console.error(err)
    }
  }

  // 2. The Risk Engine Logic
  const simulatedLoans = computed(() => {
    return loans.value.map(loan => {
      // --- A. Base Metrics ---
      let currentDSCR = loan.dscr_current
      let riskScore = 100 // Start with a perfect score (100/100)
      
      // --- B. Factor Impacts ---
      
      // 1. Interest Rate Impact (High Weight)
      // Higher rates = higher interest payments = lower DSCR
      const rateImpact = factors.value.interestRate * 0.15
      let simulatedDSCR = currentDSCR - rateImpact

      // 2. Revenue Shock Impact (High Weight)
      // If user simulates a 10% sales drop, DSCR takes a massive hit
      const revenueImpact = factors.value.revenueShock * 0.02 
      simulatedDSCR -= revenueImpact

      // 3. Inflation Impact (Medium Weight)
      // Inflation eats into profit margins
      const inflationImpact = (factors.value.inflation - 2) * 0.05
      simulatedDSCR -= Math.max(0, inflationImpact)

      // --- C. Scoring Algorithm ---
      
      // Rule 1: DSCR Health (The biggest factor)
      if (simulatedDSCR >= 1.5) riskScore -= 0
      else if (simulatedDSCR >= 1.25) riskScore -= 15
      else if (simulatedDSCR >= 1.1) riskScore -= 35
      else riskScore -= 65 // Critical Zone

      // Rule 2: Sector Sensitivity (The "Smart" Factor)
      // If GDP is negative (Recession), "Retail" and "Transport" suffer more than "Energy"
      if (factors.value.gdpGrowth < 0) {
        if (['Retail', 'Transport'].includes(loan.sector)) {
            riskScore -= 20 // Recession Penalty
        }
      }

      // Rule 3: Leverage Penalty
      // Big loans (>10M) are riskier in high-rate environments
      if (factors.value.interestRate > 4 && loan.amount > 10000000) {
        riskScore -= 10
      }

      // Clamp score between 0 and 100
      riskScore = Math.max(0, Math.min(100, riskScore))

      // --- D. Determine Status ---
      let status = 'Green'
      if (riskScore < 50) status = 'Red'
      else if (riskScore < 75) status = 'Amber'

      return { 
        ...loan, 
        simulatedDSCR: simulatedDSCR.toFixed(2), 
        riskScore: Math.round(riskScore),
        status 
      }
    })
  })

  return { loans, factors, fetchLoans, simulatedLoans }
})