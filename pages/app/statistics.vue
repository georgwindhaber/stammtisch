<script setup lang="ts">
import {
  createBarChartRace,
  createStackedAreaChart,
  type DrinkEntry,
} from "~/composables/useCharts";

const drinks = await useFetch("/api/statistics");

const chartContainer = ref<HTMLElement | null>(null);
const areaChartContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!drinks.data.value || !chartContainer.value) return;

  const data = drinks.data.value as unknown as DrinkEntry[];

  // Wait for next tick to ensure container has proper dimensions
  nextTick(() => {
    if (!chartContainer.value) return;

    // Create bar chart race
    const cleanupBarChart = createBarChartRace(chartContainer, data);

    // Create stacked area chart
    const cleanupAreaChart = createStackedAreaChart(areaChartContainer, data);

    // Cleanup on unmount
    onUnmounted(() => {
      cleanupBarChart();
      cleanupAreaChart();
    });
  });
});
</script>

<template>
  <div class="w-full">
    <h1 class="text-lg font-bold text-center">Bier Rennen</h1>
    <h2 class="text-sm text-center">Getrunkene Bier pro Mitglied</h2>
    <div ref="chartContainer" class="chart-container w-dvw"></div>
    <div class="h-[460px]"></div>
    <h1 class="text-lg font-bold text-center mt-8">Stacked Area Chart</h1>
    <h2 class="text-sm text-center mb-4">Tägliche Bier-Konsum über ein Jahr</h2>
    <div ref="areaChartContainer" class="area-chart-container w-full"></div>
    <div class="h-[460px]"></div>
  </div>
</template>

<style scoped>
.chart-container {
  margin: 20px auto;
  position: absolute;
  left: 0;
  right: 0;
  width: 100vw;
  min-width: 800px;
}

.area-chart-container {
  margin: 20px auto;
  max-width: 1200px;
  padding: 0 20px;
  position: absolute;
  left: 0;
  right: 0;
}

:deep(.bar) {
  transition: width 0.75s ease;
}

:deep(.label) {
  font-weight: 500;
}

:deep(.value) {
  font-weight: bold;
}
</style>
