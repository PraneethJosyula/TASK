// src/components/GlucoseRangeChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './GlucoseRangeChart.css';

const GlucoseRangeChartSingle = ({ person, data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Clear previous chart
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Define dimensions and margins
    const width = 400;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };

    svg.attr('width', width).attr('height', height);

    // Filter data for the given person
    const personData = data.filter(d => d.person === person);
    
    // Compute counts for each category:
    const lowCount = personData.filter(d => d.blood_glucose < 60).length;
    const inRangeCount = personData.filter(d => d.blood_glucose >= 60 && d.blood_glucose <= 180).length;
    const highCount = personData.filter(d => d.blood_glucose > 180).length;

    const counts = [
      { category: 'Low', count: lowCount },
      { category: 'In Range', count: inRangeCount },
      { category: 'High', count: highCount },
    ];

    // Create scales
    const xScale = d3.scaleBand()
      .domain(counts.map(d => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(counts, d => d.count) || 1])
      .range([height - margin.bottom, margin.top])
      .nice();

    // Append axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    // Choose bar color based on person (red for Person X, blue for Person Y)
    const barColor = person === 'Person X' ? 'red' : 'blue';

    // Draw bars
    svg.selectAll('.bar')
      .data(counts)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.category))
      .attr('y', d => yScale(d.count))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - margin.bottom - yScale(d.count))
      .attr('fill', barColor);

    // Add text labels on top of bars
    svg.selectAll('.label')
      .data(counts)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => xScale(d.category) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.count) - 5)
      .attr('text-anchor', 'middle')
      .text(d => d.count);
  }, [data, person]);

  return (
    <div className="glucose-range-chart-container">
      <h3>{person} - Glucose Range Breakdown</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

const GlucoseRangeChart = ({ data }) => {
  // Determine which persons are included in the data
  const persons = Array.from(new Set(data.map(d => d.person)));
  return (
    <div>
      {persons.includes("Person X") && <GlucoseRangeChartSingle person="Person X" data={data} />}
      {persons.includes("Person Y") && <GlucoseRangeChartSingle person="Person Y" data={data} />}
    </div>
  );
};

export default GlucoseRangeChart;