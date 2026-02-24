import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const { height } = Dimensions.get('window');

export default function AddExpenseModal({ visible, onClose, onAdd }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food'); // Default

  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleAdd = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!description.trim()) {
      alert('Description is required');
      return;
    }

    onAdd({
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toISOString().split('T')[0],
    });

    // Reset fields
    setAmount('');
    setDescription('');
    setCategory('Food');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: backdropOpacity },
        ]}
      >
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Expense</Text>

            <TextInput
              style={styles.input}
              placeholder="Amount (৳)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholderTextColor="#adb5bd"
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#adb5bd"
            />

            {/* Simple category picker - later we can make it nicer */}
            <View style={styles.categoryRow}>
              {['Food', 'Transport', 'Housing', 'Entertainment', 'Other'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryBtn,
                    cat === category && styles.categoryBtnActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      cat === category && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>Add Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  backdropTouch: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.75,
  },
  modalContent: {
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  categoryBtn: {
    backgroundColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
  },
  categoryBtnActive: {
    backgroundColor: '#6f42c1',
  },
  categoryText: {
    color: '#495057',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  addBtn: {
    backgroundColor: '#20c997',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelText: {
    color: '#6c757d',
    textAlign: 'center',
    fontSize: 16,
  },
});