<script setup lang="ts">
import * as d3 from "d3";

const drinks = await useFetch("/api/statistics");

const chartContainer = ref<HTMLElement | null>(null);

interface DrinkEntry {
  value: number;
  name: string | null;
  userId: number | null;
  createdAt: Date | string | number;
}

interface UserData {
  userId: number;
  name: string;
  total: number;
}

onMounted(() => {
  if (!drinks.data.value || !chartContainer.value) return;

  const data = drinks.data.value as unknown as DrinkEntry[];

  // Group drinks by userId and create time-based cumulative data
  const userMap = new Map<
    number,
    { name: string; entries: Array<{ time: number; value: number }> }
  >();

  data.forEach((drink) => {
    if (!drink.userId) return;
    const userId = drink.userId;
    if (!userMap.has(userId)) {
      userMap.set(userId, {
        name: drink.name || `User ${userId}`,
        entries: [],
      });
    }
    const user = userMap.get(userId)!;
    const time =
      drink.createdAt instanceof Date
        ? drink.createdAt.getTime()
        : typeof drink.createdAt === "string"
        ? new Date(drink.createdAt).getTime()
        : drink.createdAt;
    user.entries.push({ time, value: drink.value });
  });

  // Sort entries by time and create cumulative totals
  const timePoints = new Set<number>();
  userMap.forEach((user) => {
    user.entries.sort((a, b) => a.time - b.time);
    let cumulative = 0;
    user.entries = user.entries.map((entry) => {
      cumulative += entry.value;
      timePoints.add(entry.time);
      return { time: entry.time, value: cumulative };
    });
  });

  const sortedTimePoints = Array.from(timePoints).sort((a, b) => a - b);

  // Create data for each time point
  const timeSeriesData: Array<{ time: number; users: UserData[] }> = [];

  sortedTimePoints.forEach((time) => {
    const users: UserData[] = [];
    userMap.forEach((userData, userId) => {
      // Find the last entry before or at this time
      const relevantEntry = userData.entries
        .filter((e) => e.time <= time)
        .sort((a, b) => b.time - a.time)[0];

      if (relevantEntry) {
        users.push({
          userId,
          name: userData.name,
          total: relevantEntry.value,
        });
      }
    });

    // Sort by total descending
    users.sort((a, b) => b.total - a.total);
    timeSeriesData.push({ time, users });
  });

  // Check if we have data
  if (timeSeriesData.length === 0) {
    d3.select(chartContainer.value)
      .append("div")
      .style("text-align", "center")
      .style("padding", "40px")
      .text("No data available");
    return;
  }

  // Set up dimensions
  const margin = { top: 60, right: 150, bottom: 30, left: 200 };
  const width = 800 - margin.left - margin.right;
  const height = 550 - margin.top - margin.bottom;
  const barHeight = 30;
  const topN = 10; // Show top 10 users

  const animationDuration = 300;
  const speed = 250;

  // Clear previous content
  d3.select(chartContainer.value).selectAll("*").remove();

  const svg = d3
    .select(chartContainer.value)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Find max value for scaling
  const maxValue =
    d3.max(timeSeriesData, (d: (typeof timeSeriesData)[0]) =>
      d3.max(d.users.slice(0, topN), (u: UserData) => u.total)
    ) || 1;

  // Create scales
  const xScale = d3.scaleLinear().domain([0, maxValue]).range([0, width]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Create initial bars
  let currentData = timeSeriesData[0];
  let currentIndex = 0;

  const updateChart = (data: (typeof timeSeriesData)[0]) => {
    const topUsers = data.users.slice(0, topN);

    // Update scales
    const maxVal = d3.max(topUsers, (u: UserData) => u.total) || 1;
    xScale.domain([0, maxVal]);

    // Bind data
    const bars = g
      .selectAll<SVGGElement, UserData>(".bar-group")
      .data(topUsers, (d: UserData) => d.userId.toString());

    // Enter: create new bars
    const barEnter = bars
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr(
        "transform",
        (_d: UserData, i: number) => `translate(0, ${i * barHeight})`
      );

    barEnter
      .append("rect")
      .attr("class", "bar")
      .attr("height", barHeight - 2)
      .attr("fill", (d: UserData) => colorScale(d.userId.toString()))
      .attr("x", 0)
      .attr("width", 0);

    barEnter
      .append("text")
      .attr("class", "index")
      .attr("x", -220)
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "#d3d3d3")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text((_d: UserData, i: number) => `#${i + 1}`);

    barEnter
      .append("text")
      .attr("class", "label")
      .attr("x", -10)
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .attr("fill", "#d3d3d3")
      .style("font-size", "14px")
      .text((d: UserData) => d.name);

    barEnter
      .append("text")
      .attr("class", "value")
      .attr("x", 5)
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("fill", "#333")
      .style("font-size", "14px")
      .text((d: UserData) => d.total.toString());

    // Update: animate bars
    const barUpdate = bars.merge(barEnter);

    barUpdate
      .select<SVGRectElement>(".bar")
      .transition()
      .duration(speed)
      .attr("width", (d: UserData) => xScale(d.total));

    barUpdate
      .select<SVGTextElement>(".value")
      .transition()
      .duration(speed)
      .text((d: UserData) => d.total.toString());

    barUpdate
      .select<SVGTextElement>(".index")
      .transition()
      .duration(speed)
      .text((_d: UserData, i: number) => `#${i + 1}`);

    // Update positions based on ranking
    barUpdate
      .transition()
      .duration(speed)
      .attr(
        "transform",
        (_d: UserData, i: number) => `translate(0, ${i * barHeight})`
      );

    // Exit: remove old bars
    bars
      .exit<SVGGElement>()
      .transition()
      .duration(speed)
      .attr("transform", () => `translate(0, ${(topN + 1) * barHeight})`)
      .remove();
  };

  // Initial render
  updateChart(currentData);

  // Create initial time label
  g.append("text")
    .attr("class", "time-label")
    .attr("x", width / 2)
    .attr("y", -35)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .style("font-size", "28px")
    .style("font-weight", "bold")
    .text(() => new Date(currentData.time).toLocaleString("de-DE"));

  // Animate through time
  const animate = () => {
    if (currentIndex < timeSeriesData.length - 1) {
      currentIndex++;
      currentData = timeSeriesData[currentIndex];
      updateChart(currentData);

      // Update time label if needed
      const timeLabel = g
        .selectAll<SVGTextElement, typeof currentData>(".time-label")
        .data([currentData]);
      timeLabel
        .enter()
        .append("text")
        .attr("class", "time-label")
        .attr("x", width / 2)
        .attr("y", -35)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "28px")
        .style("font-weight", "bold")
        .merge(timeLabel)
        .attr("fill", "white")
        .style("font-size", "28px")
        .style("font-weight", "bold")
        .attr("y", -35)
        .text(() => new Date(currentData.time).toLocaleString("de-DE"));
    } else {
      currentIndex = 0;
      currentData = timeSeriesData[0];
      updateChart(currentData);
    }
  };

  // Auto-animate every 2 seconds
  const interval = setInterval(animate, animationDuration);

  // Cleanup on unmount
  onUnmounted(() => {
    clearInterval(interval);
  });
});
</script>

<template>
  <div>
    <h1>Statistics</h1>
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
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
