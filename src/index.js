import * as d3 from 'd3';
import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then((response) => response.json())
    .then((data) => {
      let width = '1500';
      let height = '700';
      let padding = '50';

      let xScale = d3
        .scaleTime()
        .domain([
          d3.min(data.data, (d) => new Date(d[0])),
          d3.max(data.data, (d) => new Date(d[0])),
        ])
        .range([padding, width - padding]);

      let yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data.data, (d) => d[1])])
        .range([height - padding, padding]);

      //main chart area
      let chart = d3.select('#d3').append('svg').attr('height', height).attr('width', width);

      //bar
      chart
        .selectAll('svg')
        .data(data.data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', (d) => d[0])
        .attr('data-gdp', (d) => d[1])
        .attr('height', (d) => height - padding - yScale(d[1]))
        .attr('width', '6')
        .attr('x', (d) => xScale(new Date(d[0])))
        .attr('y', (d) => yScale(d[1]))
        .on('mouseenter', function () {
          let pos = d3.pointer(event);
          let d = d3.select(this).data()[0];

          d3.select(this).attr('fill', 'orange');

          d3.select('#tooltip')
            .style('display', 'flex')
            .style('top', pos[1] + 'px')
            .style('left', pos[0] + 40 + 'px')
            .style('flex-direction', 'column')
            .style('align-items', 'center')
            .style('justify-content', 'center')
            .attr('id', 'tooltip')
            .attr('data-date', d[0])
            .html(
              'Date: ' +
                new Date(d[0]).getFullYear() +
                ' Qtr ' +
                Math.ceil((new Date(d[0]).getMonth() + 1) / 3) +
                '<br>' +
                'GDP: ' +
                '$ ' +
                d[1] +
                ' Billion',
            );
        })
        .on('mouseleave', function () {
          d3.select('#tooltip').style('display', 'none');
          d3.select(this).attr('fill', 'black');
        });

      let xAxis = d3.axisBottom(xScale);
      let yAxis = d3.axisLeft(yScale);

      //x-axis
      chart
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')
        .call(xAxis);

      //y-axis
      chart
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')
        .call(yAxis);
    });
});
