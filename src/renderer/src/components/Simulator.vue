<script setup>
import { useLoanStore } from '../stores/loanStore'
const store = useLoanStore()
</script>

<template>
  <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span>🎛️</span> Macro-Economic Simulator
      </h2>
      <button 
        @click="store.$reset" 
        class="text-xs text-blue-600 hover:underline cursor-pointer"
      >
        Reset Defaults
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-600 flex justify-between">
          Interest Rate (EURIBOR)
          <span class="text-blue-600 font-bold">{{ store.factors.interestRate }}%</span>
        </label>
        <input 
          type="range" min="0" max="10" step="0.25" 
          v-model="store.factors.interestRate"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        >
        <p class="text-xs text-gray-400">Directly impacts debt service costs.</p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-600 flex justify-between">
          GDP Growth
          <span :class="store.factors.gdpGrowth < 0 ? 'text-red-500 font-bold' : 'text-green-500 font-bold'">
            {{ store.factors.gdpGrowth }}%
          </span>
        </label>
        <input 
          type="range" min="-5" max="5" step="0.5" 
          v-model="store.factors.gdpGrowth"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        >
        <p class="text-xs text-gray-400">Recession (< 0%) hits Retail/Transport hard.</p>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-600 flex justify-between">
          Global Revenue Shock
          <span class="text-red-500 font-bold">-{{ store.factors.revenueShock }}%</span>
        </label>
        <input 
          type="range" min="0" max="30" step="5" 
          v-model="store.factors.revenueShock"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
        >
        <p class="text-xs text-gray-400">Simulate a market crash scenario.</p>
      </div>

    </div>
  </div>
</template>