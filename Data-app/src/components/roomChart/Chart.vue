<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props:['chartData','options'],
  methods: {
    update() {
      this.$data._chart.update()
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
    this.addPlugin({id:'my-plugin',
   afterDatasetsDraw: function(chart) {
       
        if (chart.tooltip._active && chart.tooltip._active.length ) {
             var activePoint = chart.tooltip._active[0],
             ctx = chart.chart.ctx,
             x_axis = chart.scales['x-axis-0'],
            y_axis = chart.scales['y-axis-0'],
            x = activePoint.tooltipPosition().x,
            topY = y_axis.top,
            bottomY = y_axis.bottom;
      

       // draw line
       ctx.save();
       ctx.beginPath();
       ctx.moveTo(x, topY);
       ctx.lineTo(x, bottomY);
       
       ctx.lineWidth = 1;
       ctx.strokeStyle = '#07C';
       ctx.stroke();
       ctx.restore();
     }}})
  }
};
</script>
