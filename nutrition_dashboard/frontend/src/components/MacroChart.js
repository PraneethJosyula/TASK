// src/components/MacroChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './MacroChart.css';

// This component renders a macro chart for one person.
const MacroChartSingle = ({ person, data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Remove any previous chart
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Dimensions and margins
    const width = 800;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };

    svg.attr("width", width).attr("height", height);

    // Filter data for the given person and convert dates
    const personData = data
      .filter(d => d.person === person)
      .map(d => ({ ...d, date: new Date(d.date) }));

    // Group data by month (format: "YYYY-M")
    const grouped = d3.group(personData, d => `${d.date.getFullYear()}-${d.date.getMonth() + 1}`);
    const monthlyData = Array.from(grouped, ([month, records]) => ({
      month,
      avgCarbs: d3.mean(records, d => d.carbs),
      avgProtein: d3.mean(records, d => d.protein),
      avgFat: d3.mean(records, d => d.fat)
    }));

    // Sort monthly data chronologically
    monthlyData.sort((a, b) => {
      const [yearA, monthA] = a.month.split("-").map(Number);
      const [yearB, monthB] = b.month.split("-").map(Number);
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    // Create x-scale: using a band scale for the month labels
    const xScale = d3.scaleBand()
      .domain(monthlyData.map(d => d.month))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    // Determine max value across all macros
    const maxY = d3.max(monthlyData, d => Math.max(d.avgCarbs, d.avgProtein, d.avgFat)) || 1;
    const yScale = d3.scaleLinear()
      .domain([0, maxY])
      .range([height - margin.bottom, margin.top])
      .nice();

    // Create x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Create y-axis
    const yAxis = d3.axisLeft(yScale).ticks(5);
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    // Define colors for macros
    const macroColors = {
      "Carbs": "#1f77b4",
      "Protein": "#ff7f0e",
      "Fat": "#2ca02c"
    };

    // For each month, draw grouped bars for the three macros
    // Each group will have three bars
    const barGroup = svg.selectAll(".bar-group")
      .data(monthlyData)
      .enter()
      .append("g")
      .attr("class", "bar-group")
      .attr("transform", d => `translate(${xScale(d.month)},0)`);

    // Calculate width for each bar
    const barWidth = xScale.bandwidth() / 3;

    // Carbs bar (left)
    barGroup.append("rect")
      .attr("x", 0)
      .attr("y", d => yScale(d.avgCarbs))
      .attr("width", barWidth)
      .attr("height", d => height - margin.bottom - yScale(d.avgCarbs))
      .attr("fill", macroColors["Carbs"]);

    // Protein bar (middle)
    barGroup.append("rect")
      .attr("x", barWidth)
      .attr("y", d => yScale(d.avgProtein))
      .attr("width", barWidth)
      .attr("height", d => height - margin.bottom - yScale(d.avgProtein))
      .attr("fill", macroColors["Protein"]);

    // Fat bar (right)
    barGroup.append("rect")
      .attr("x", 2 * barWidth)
      .attr("y", d => yScale(d.avgFat))
      .attr("width", barWidth)
      .attr("height", d => height - margin.bottom - yScale(d.avgFat))
      .attr("fill", macroColors["Fat"]);

    // Add a simple legend at the top-right corner
    const legendData = Object.keys(macroColors);
    const legend = svg.append("g")
      .attr("transform", `translate(${width - margin.right - 100}, ${margin.top - 10})`);

    legend.selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 18)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", d => macroColors[d]);

    legend.selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .attr("x", 18)
      .attr("y", (d, i) => i * 18 + 10)
      .text(d => d)
      .attr("font-size", "12px")
      .attr("fill", "#000");
      
  }, [data, person]);

  return (
    <div className="macro-chart-container">
      <h3>{person} - Monthly Average Macros</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

// The main MacroChart component checks which persons exist in the data and renders accordingly.
const MacroChart = ({ data }) => {
  // Get unique persons in the data. If a filter is applied and only one person exists, only that chart is shown.
  const persons = Array.from(new Set(data.map(d => d.person)));
  return (
    <div>
      {persons.includes("Person X") && <MacroChartSingle person="Person X" data={data} />}
      {persons.includes("Person Y") && <MacroChartSingle person="Person Y" data={data} />}
    </div>
  );
};

export default MacroChart;