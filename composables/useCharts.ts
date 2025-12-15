import * as d3 from "d3";

export interface DrinkEntry {
  value: number;
  name: string | null;
  userId: number | null;
  createdAt: Date | string | number;
  role?: string | null;
}

export interface UserData {
  userId: number;
  name: string;
  total: number;
}

interface TimeSeriesDataPoint {
  time: number;
  users: UserData[];
}

export function createBarChartRace(
  container: Ref<HTMLElement | null>,
  data: DrinkEntry[]
): () => void {
  if (!container.value) return () => {};

  // Group drinks by day and userId
  const dailyDataMap = new Map<string, Map<number, number>>(); // dayKey -> userId -> total drinks that day
  const userNamesMap = new Map<number, string>();
  const allDates: Date[] = [];

  data.forEach((drink) => {
    if (!drink.userId) return;
    const userId = drink.userId;

    // Store user name
    if (drink.name && !userNamesMap.has(userId)) {
      userNamesMap.set(userId, drink.name);
    }

    const time =
      drink.createdAt instanceof Date
        ? drink.createdAt.getTime()
        : typeof drink.createdAt === "string"
        ? new Date(drink.createdAt).getTime()
        : drink.createdAt;
    const date = new Date(time);

    // Normalize to start of day
    date.setHours(0, 0, 0, 0);
    const dayKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (!dailyDataMap.has(dayKey)) {
      dailyDataMap.set(dayKey, new Map());
      allDates.push(new Date(date));
    }
    const dayMap = dailyDataMap.get(dayKey)!;
    dayMap.set(userId, (dayMap.get(userId) || 0) + drink.value);
  });

  // Find date range
  if (allDates.length === 0) {
    d3.select(container.value)
      .append("div")
      .style("text-align", "center")
      .style("padding", "40px")
      .text("No data available");
    return () => {};
  }

  const minDate = d3.min(allDates)!;
  const maxDate = d3.max(allDates)!;

  // Generate all days in the range
  const allDays: Date[] = [];
  const currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    allDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Create cumulative totals per user
  const cumulativeTotals = new Map<number, number>(); // userId -> cumulative total

  // Create data for each day
  const timeSeriesData: TimeSeriesDataPoint[] = [];

  allDays.forEach((date) => {
    const dayKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Get drinks for this day
    const dayMap = dailyDataMap.get(dayKey) || new Map();

    // Update cumulative totals for each user
    dayMap.forEach((dailyValue, userId) => {
      const currentTotal = cumulativeTotals.get(userId) || 0;
      cumulativeTotals.set(userId, currentTotal + dailyValue);
    });

    // Create user data array with current cumulative totals
    const users: UserData[] = [];
    cumulativeTotals.forEach((total, userId) => {
      users.push({
        userId,
        name: userNamesMap.get(userId) || `User ${userId}`,
        total,
      });
    });

    // Sort by total descending
    users.sort((a, b) => b.total - a.total);

    // Use start of day timestamp
    const dayTimestamp = date.getTime();
    timeSeriesData.push({ time: dayTimestamp, users });
  });

  // Check if we have data
  if (timeSeriesData.length === 0) {
    d3.select(container.value)
      .append("div")
      .style("text-align", "center")
      .style("padding", "40px")
      .text("No data available");
    return () => {};
  }

  // Set up dimensions
  const margin = { top: 60, right: 150, bottom: 30, left: 200 };

  // Get container width for responsive design
  const getContainerWidth = () => {
    return container.value?.clientWidth || 800;
  };

  let containerWidth = getContainerWidth();
  let width = containerWidth - margin.left - margin.right;
  const height = 550 - margin.top - margin.bottom;
  const barHeight = 30;
  const topN = 10; // Show top 10 users

  const animationDuration = 75;
  const speed = 50;

  // Clear previous content
  d3.select(container.value).selectAll("*").remove();

  const svg = d3
    .select(container.value)
    .append("svg")
    .attr("width", "100%")
    .attr("height", height + margin.top + margin.bottom)
    .attr(
      "viewBox",
      `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`
    )
    .attr("preserveAspectRatio", "xMinYMin meet");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Find max value for scaling
  const maxValue =
    d3.max(timeSeriesData, (d: TimeSeriesDataPoint) =>
      d3.max(d.users.slice(0, topN), (u: UserData) => u.total)
    ) || 1;

  // Create scales
  const xScale = d3.scaleLinear().domain([0, maxValue]).range([0, width]);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Create initial bars
  let currentData = timeSeriesData[0];
  let currentIndex = 0;
  let animationInterval: ReturnType<typeof setInterval> | null = null;

  const updateChart = (data: TimeSeriesDataPoint) => {
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
    .text(() => new Date(currentData.time).toLocaleDateString("de-DE"));

  // Animate through time
  const animate = () => {
    if (currentIndex < timeSeriesData.length - 1) {
      currentIndex++;
      currentData = timeSeriesData[currentIndex];
      updateChart(currentData);

      // Update time label if needed
      const timeLabel = g
        .selectAll<SVGTextElement, TimeSeriesDataPoint>(".time-label")
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
        .text(() => new Date(currentData.time).toLocaleDateString("de-DE"));
    } else {
      // Stop animation when reaching the end
      if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
      }
    }
  };

  // Auto-animate every 2 seconds
  animationInterval = setInterval(animate, animationDuration);

  // Update viewBox on resize
  const updateDimensions = () => {
    containerWidth = getContainerWidth();
    width = containerWidth - margin.left - margin.right;
    svg.attr(
      "viewBox",
      `0 0 ${containerWidth} ${height + margin.top + margin.bottom}`
    );
    // Update time label position
    g.selectAll<SVGTextElement, unknown>(".time-label").attr("x", width / 2);
  };

  // Handle window resize
  const resizeObserver = new ResizeObserver(updateDimensions);
  if (container.value) {
    resizeObserver.observe(container.value);
  }

  // Return cleanup function
  return () => {
    if (animationInterval) {
      clearInterval(animationInterval);
    }
    resizeObserver.disconnect();
  };
}

export function createStackedAreaChart(
  container: Ref<HTMLElement | null>,
  data: DrinkEntry[]
): () => void {
  if (!container.value) return () => {};

  // Filter to only include members
  const memberData = data.filter((drink) => drink.role === "member");

  // Process data for area chart: aggregate by day and user
  const dailyDataMap = new Map<string, Map<number, number>>(); // day -> userId -> count

  memberData.forEach((drink) => {
    if (!drink.userId) return;
    const time =
      drink.createdAt instanceof Date
        ? drink.createdAt.getTime()
        : typeof drink.createdAt === "string"
        ? new Date(drink.createdAt).getTime()
        : drink.createdAt;
    const date = new Date(time);
    const dayKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    if (!dailyDataMap.has(dayKey)) {
      dailyDataMap.set(dayKey, new Map());
    }
    const dayMap = dailyDataMap.get(dayKey)!;
    dayMap.set(drink.userId, (dayMap.get(drink.userId) || 0) + drink.value);
  });

  // Get date range - from first to last entry
  const allDates = Array.from(dailyDataMap.keys()).map((d) => new Date(d));
  const minDate = allDates.length > 0 ? d3.min(allDates)! : new Date();
  const maxDate = allDates.length > 0 ? d3.max(allDates)! : new Date();

  // Generate all days in the range (inclusive of both start and end dates)
  const allDays: Date[] = [];
  const currentDate = new Date(minDate);
  while (currentDate <= maxDate) {
    allDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Get all unique user IDs (only members)
  const userIds = Array.from(
    new Set(memberData.filter((d) => d.userId).map((d) => d.userId!))
  );
  const userNamesMap = new Map<number, string>();
  memberData.forEach((d) => {
    if (d.userId && d.name) {
      userNamesMap.set(d.userId, d.name);
    }
  });

  // Create data structure for stacking: array of {date, userId1: value, userId2: value, ...}
  // Accumulate drinks over time (cumulative)
  const cumulativeTotals = new Map<number, number>(); // userId -> cumulative total
  userIds.forEach((userId) => cumulativeTotals.set(userId, 0));

  const areaChartData = allDays.map((date) => {
    const dayKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const dayMap = dailyDataMap.get(dayKey) || new Map();
    const obj: Record<string, number | Date> = { date };

    // Accumulate values for each user
    userIds.forEach((userId) => {
      const dailyValue = dayMap.get(userId) || 0;
      const currentTotal = cumulativeTotals.get(userId) || 0;
      const newTotal = currentTotal + dailyValue;
      cumulativeTotals.set(userId, newTotal);
      obj[userId.toString()] = newTotal;
    });
    return obj;
  });

  // Set up dimensions for area chart
  const areaMargin = { top: 20, right: 50, bottom: 60, left: 60 };
  const getAreaContainerWidth = () => {
    return container.value?.clientWidth || 800;
  };
  let areaContainerWidth = getAreaContainerWidth();
  let areaWidth = areaContainerWidth - areaMargin.left - areaMargin.right;
  const areaHeight = 400 - areaMargin.top - areaMargin.bottom;

  // Clear previous content
  d3.select(container.value).selectAll("*").remove();

  const areaSvg = d3
    .select(container.value)
    .append("svg")
    .attr("width", "100%")
    .attr("height", areaHeight + areaMargin.top + areaMargin.bottom)
    .attr(
      "viewBox",
      `0 0 ${areaContainerWidth} ${
        areaHeight + areaMargin.top + areaMargin.bottom
      }`
    )
    .attr("preserveAspectRatio", "xMinYMin meet");

  const areaG = areaSvg
    .append("g")
    .attr("transform", `translate(${areaMargin.left},${areaMargin.top})`);

  // Create scales
  const xScaleArea = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([0, areaWidth]);

  // Calculate max value for y scale (sum of all users cumulative totals)
  const maxDailyTotal =
    d3.max(areaChartData, (d) => {
      return userIds.reduce(
        (sum, userId) => sum + (d[userId.toString()] as number),
        0
      );
    }) || 1;

  const yScaleArea = d3
    .scaleLinear()
    .domain([0, maxDailyTotal])
    .range([areaHeight, 0]);

  // Create stack generator
  const stack = d3
    .stack<Record<string, number | Date>>()
    .keys(userIds.map((id) => id.toString()))
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  const stackedData = stack(areaChartData);

  // Create area generator
  const area = d3
    .area<d3.SeriesPoint<Record<string, number | Date>>>()
    .x((d) => xScaleArea(d.data.date as Date))
    .y0((d) => yScaleArea(d[0]))
    .y1((d) => yScaleArea(d[1]))
    .curve(d3.curveMonotoneX);

  // Color scale
  const areaColorScale = d3.scaleOrdinal(d3.schemeCategory10);

  // Draw areas
  const areaPaths = areaG
    .selectAll<
      SVGPathElement,
      d3.Series<Record<string, number | Date>, string>
    >("path")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("fill", (d) => areaColorScale(d.key))
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5)
    .attr("d", (d) => area(d) || "");

  // Add labels for each area
  areaG
    .selectAll<
      SVGTextElement,
      d3.Series<Record<string, number | Date>, string>
    >("text.area-label")
    .data(stackedData)
    .enter()
    .append("text")
    .attr("class", "area-label")
    .attr("x", areaWidth - 10)
    .attr("y", (d) => {
      // Position label at the middle of the area at the end (right side)
      const lastPoint = d[d.length - 1];
      const middleY = (lastPoint[0] + lastPoint[1]) / 2;
      return yScaleArea(middleY);
    })
    .attr("text-anchor", "end")
    .attr("dy", "0.35em")
    .style("fill", "#333")
    .style("stroke", "white")
    .style("stroke-width", "3px")
    .style("stroke-linejoin", "round")
    .style("paint-order", "stroke fill")
    .style("font-size", "12px")
    .style("font-weight", "500")
    .text((d) => {
      const userId = parseInt(d.key);
      return userNamesMap.get(userId) || `User ${userId}`;
    });

  // Add x-axis
  const xAxis = d3.axisBottom(xScaleArea).ticks(d3.timeMonth.every(1));
  areaG
    .append("g")
    .attr("transform", `translate(0, ${areaHeight})`)
    .call(xAxis)
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");

  // Add y-axis
  const yAxis = d3.axisLeft(yScaleArea);
  areaG.append("g").call(yAxis);

  // Add axis labels
  areaG
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - areaMargin.left)
    .attr("x", 0 - areaHeight / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "#d3d3d3")
    .text("Anzahl Bier");

  // Handle resize for area chart
  const updateAreaDimensions = () => {
    areaContainerWidth = getAreaContainerWidth();
    areaWidth = areaContainerWidth - areaMargin.left - areaMargin.right;
    areaSvg.attr(
      "viewBox",
      `0 0 ${areaContainerWidth} ${
        areaHeight + areaMargin.top + areaMargin.bottom
      }`
    );
    xScaleArea.range([0, areaWidth]);
    yScaleArea.range([areaHeight, 0]);

    // Redraw
    areaG
      .selectAll<
        SVGPathElement,
        d3.Series<Record<string, number | Date>, string>
      >("path")
      .attr("d", (d) => area(d) || "");

    // Update labels position
    areaG
      .selectAll<
        SVGTextElement,
        d3.Series<Record<string, number | Date>, string>
      >("text.area-label")
      .attr("x", areaWidth - 10)
      .attr("y", (d) => {
        const lastPoint = d[d.length - 1];
        const middleY = (lastPoint[0] + lastPoint[1]) / 2;
        return yScaleArea(middleY);
      });

    areaG.selectAll<SVGGElement, unknown>(".x-axis").remove();
    areaG.selectAll<SVGGElement, unknown>(".y-axis").remove();

    const newXAxis = d3.axisBottom(xScaleArea).ticks(d3.timeMonth.every(1));
    areaG
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${areaHeight})`)
      .call(newXAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    const newYAxis = d3.axisLeft(yScaleArea);
    areaG.append("g").attr("class", "y-axis").call(newYAxis);
  };

  const areaResizeObserver = new ResizeObserver(updateAreaDimensions);
  if (container.value) {
    areaResizeObserver.observe(container.value);
  }

  // Return cleanup function
  return () => {
    areaResizeObserver.disconnect();
  };
}
