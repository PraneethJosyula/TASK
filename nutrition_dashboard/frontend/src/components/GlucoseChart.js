// src/components/GlucoseChart.js
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './GlucoseChart.css';

const GlucoseChart = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    // Remove any existing content
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Dimensions and margins
    const width = 2000; // wider than container to enable horizontal scrolling
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    svg.attr('width', width).attr('height', height);
    svg.style("background-color", "#f0f4f8"); // soothing background color

    // Separate data by person and parse date strings into Date objects
    const personXData = data.filter(d => d.person === 'Person X').map(d => ({ ...d, date: new Date(d.date) }));
    const personYData = data.filter(d => d.person === 'Person Y').map(d => ({ ...d, date: new Date(d.date) }));

    // Combine all dates and glucose values to set scales
    const allDates = data.map(d => new Date(d.date));
    const allGlucose = data.map(d => d.blood_glucose);

    // Define xScale (time scale) and yScale (linear scale)
    const xScale = d3.scaleTime()
      .domain(d3.extent(allDates))
      .range([margin.left, width - margin.right]);

    const yMin = Math.min(d3.min(allGlucose), 60);
    const yMax = Math.max(d3.max(allGlucose), 180);
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add x-axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis with units (mg/dL)
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${d} mg/dL`));

    // Add dotted horizontal line for low glucose limit (60 mg/dL)
    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', yScale(60))
      .attr('y2', yScale(60))
      .attr('stroke', 'black')
      .attr('stroke-dasharray', '4')
      .attr('stroke-width', 1);

    // Add dotted horizontal line for high glucose limit (180 mg/dL)
    svg.append('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', yScale(180))
      .attr('y2', yScale(180))
      .attr('stroke', 'black')
      .attr('stroke-dasharray', '4')
      .attr('stroke-width', 1);

    // Create tooltip element
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'rgba(0,0,0,0.7)')
      .style('color', '#fff')
      .style('padding', '5px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none');

    // Mouse event handlers for tooltip
    const handleMouseOver = (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip.html(`Glucose: ${d.blood_glucose} mg/dL<br>${d.date.toLocaleDateString()}`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    };

    const handleMouseOut = () => {
      tooltip.transition().duration(500).style('opacity', 0);
    };

    // Define line generator
    const lineGenerator = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.blood_glucose));

    // Draw line and points for Person X in red
    if (personXData.length > 0) {
      svg.append('path')
        .datum(personXData)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);

      svg.selectAll('.point-person-x')
        .data(personXData)
        .enter()
        .append('circle')
        .attr('class', 'point-person-x')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.blood_glucose))
        .attr('r', 4)
        .attr('fill', 'red')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);
    }

    // Draw line and points for Person Y in blue
    if (personYData.length > 0) {
      svg.append('path')
        .datum(personYData)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);

      svg.selectAll('.point-person-y')
        .data(personYData)
        .enter()
        .append('circle')
        .attr('class', 'point-person-y')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.blood_glucose))
        .attr('r', 4)
        .attr('fill', 'blue')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);
    }

    // Clean up tooltip on unmount
    return () => tooltip.remove();
  }, [data]);

  return (
    <div className="glucose-chart-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GlucoseChart;