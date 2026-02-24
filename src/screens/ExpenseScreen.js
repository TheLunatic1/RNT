import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import AddExpenseModal from '../components/AddExpenseModal';

export default function ExpenseScreen({ onLogout }) {
  const [expenses, setExpenses] = useState([
    { id: '1', amount: 150, description: 'Lunch', category: 'Food', date: '2025-02-20' },
    { id: '2', amount: 5000, description: 'Rent', category: 'Housing', date: '2025-02-01' },
    { id: '3', amount: 300, description: 'Coffee', category: 'Food', date: '2025-02-22' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const total = expenses.reduce((sum, item) => sum + item.amount, 0);

  const addExpense = (newExpense) => {
    setExpenses((prev) => [
      ...prev,
      { id: Date.now().toString(), ...newExpense },
    ]);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.category}>{item.category} • {item.date}</Text>
      </View>
      <Text style={styles.amount}>৳ {item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expense Tracker</Text>
        <TouchableOpacity onPress={onLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Spent</Text>
        <Text style={styles.balanceAmount}>৳ {total.toFixed(2)}</Text>
      </View>

      {/* Expense List */}
      <FlatList
        data={expenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No expenses yet. Add one!</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addExpense}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6f42c1',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  logout: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  balanceCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6f42c1',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  category: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  emptyText: {
    textAlign: 'center',
    color: '#adb5bd',
    fontSize: 18,
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#20c997',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
});