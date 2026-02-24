import React from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import Svg, { G, Rect, Text as SvgText, Line } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 60;
const chartHeight = 300;
const barWidth = 40;
const spacing = 20;
const maxBarHeight = chartHeight - 80;

export default function ChartTab({ expenses }) {
  const getBarData = () => {
    if (expenses.length === 0) return [];

    const catTotals = {};
    expenses.forEach((exp) => {
      const cat = exp.category || 'Other';
      catTotals[cat] = (catTotals[cat] || 0) + exp.amount;
    });

    const maxAmount = Math.max(...Object.values(catTotals), 1);

    return Object.entries(catTotals).map(([name, amount]) => ({
      name,
      amount,
      height: (amount / maxAmount) * maxBarHeight,
      color: getRandomColor(name),
    }));
  };

  const barData = getBarData();
  const total = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);

  if (expenses.length === 0 || barData.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <Text style={styles.emptyText}>No expenses in this date range</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.chartTabContainer}>
      <Text style={styles.chartTitle}>Expenses by Category</Text>
      <Text style={styles.totalText}>Total: ৳{total.toFixed(2)}</Text>

      <Svg width={chartWidth} height={chartHeight + 80}>
        <G>
          {/* Y-axis */}
          <Line x1={40} y1={20} x2={40} y2={chartHeight - 20} stroke="#ccc" strokeWidth="1" />

          {/* X-axis */}
          <Line x1={40} y1={chartHeight - 20} x2={chartWidth - 20} y2={chartHeight - 20} stroke="#ccc" strokeWidth="1" />

          {barData.map((bar, index) => {
            const x = 60 + index * (barWidth + spacing);
            const y = chartHeight - 20 - bar.height;

            return (
              <G key={index}>
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={bar.height}
                  fill={bar.color}
                  rx={6}
                />
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 10}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#333"
                >
                  {bar.amount.toFixed(0)}
                </SvgText>
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 15}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#495057"
                >
                  {bar.name.length > 10 ? bar.name.substring(0, 10) + '...' : bar.name}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>

      <View style={styles.legendContainer}>
        {barData.map((bar, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: bar.color }]} />
            <Text style={styles.legendText}>
              {bar.name}: ৳{bar.amount.toFixed(0)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function getRandomColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

const styles = StyleSheet.create({
  chartTabContainer: { flex: 1, padding: 20 },
  chartTitle: { fontSize: 22, fontWeight: 'bold', color: '#212529', marginBottom: 8, textAlign: 'center' },
  totalText: { fontSize: 18, color: '#6c757d', marginBottom: 20, textAlign: 'center' },
  emptyChart: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 18, color: '#6c757d', textAlign: 'center' },
  legendContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 12 },
  legendColor: { width: 16, height: 16, borderRadius: 8, marginRight: 8 },
  legendText: { fontSize: 14, color: '#495057' },
});