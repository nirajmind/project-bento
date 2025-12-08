<script setup>
import { onMounted } from 'vue'
import { useLoanStore } from '../stores/loanStore'
import Simulator from './Simulator.vue'

const store = useLoanStore()

onMounted(() => {
  store.fetchLoans()
})

const formatMoney = (amount, currency) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Green': return 'bg-green-100 text-green-800 border-green-200'
    case 'Amber': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Red': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100'
  }
}

// Color logic for the Risk Score number
const getScoreColor = (score) => {
  if (score > 80) return 'text-green-600'
  if (score > 50) return 'text-yellow-600'
  return 'text-red-600'
}
</script>

<template>
  <div class="p-6 bg-slate-50 min-h-screen font-sans">
    <header class="mb-8 flex items-center gap-3">
      <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">🍱</div>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Project Bento</h1>
        <p class="text-sm text-gray-500">Advanced Risk Analytics Engine</p>
      </div>
    </header>

    <Simulator />

    <div class="overflow-hidden rounded-xl shadow-sm bg-white border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
            <th class="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Exposure</th>
            <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Simulated DSCR</th>
            <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Score</th>
            <th class="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="loan in store.simulatedLoans" :key="loan.id" class="hover:bg-gray-50 transition-colors">
            <td class="py-4 px-6">
              <div class="font-medium text-gray-900">{{ loan.borrower }}</div>
              <div class="text-xs text-gray-500">{{ loan.sector }}</div>
            </td>
            <td class="py-4 px-6 text-right font-mono text-sm text-gray-700">
              {{ formatMoney(loan.amount, loan.currency) }}
            </td>
            <td class="py-4 px-6 text-center">
              <div class="flex flex-col items-center">
                 <span class="font-semibold text-gray-900">{{ loan.simulatedDSCR }}x</span>
                 <span class="text-[10px] text-gray-400">Min: {{ loan.dscr_min }}x</span>
              </div>
            </td>
            <td class="py-4 px-6 text-center">
               <div :class="['text-lg font-bold', getScoreColor(loan.riskScore)]">
                  {{ loan.riskScore }}<span class="text-xs text-gray-300 font-normal">/100</span>
               </div>
            </td>
            <td class="py-4 px-6 text-center">
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getStatusColor(loan.status)]">
                {{ loan.status.toUpperCase() }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>