import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Switch, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.254.3:8000/api/todoinfo/'; 

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch todos');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Validation', 'Title and Description are required.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await axios.post(API_URL, {
        title,
        description,
        completed,
      });
      setTodos([response.data, ...todos]);
      setTitle('');
      setDescription('');
      setCompleted(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add todo');
    }
    setSubmitting(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.todoTitle}>{item.title}</Text>
        <Text style={styles.todoDescription}>{item.description}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={item.completed ? styles.completed : styles.notCompleted}>
          {item.completed ? '✓' : '✗'}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.header}>TODO List</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            editable={!submitting}
          />
          <TextInput
            style={[styles.input, { height: 60 }]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            editable={!submitting}
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Completed:</Text>
            <Switch
              value={completed}
              onValueChange={setCompleted}
              disabled={submitting}
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTodo}
            disabled={submitting}
          >
            <Text style={styles.addButtonText}>{submitting ? 'Adding...' : 'Add Todo'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <FlatList
              data={todos}
              keyExtractor={item => item.id?.toString() || Math.random().toString()}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 40 }}
              ListEmptyComponent={<Text style={styles.emptyText}>No todos yet.</Text>}
            />
          )}
        </View>
        <StatusBar style="dark" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
    alignSelf: 'center',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  input: {
    backgroundColor: '#f1f3f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e3e6ea',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  todoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  todoDescription: {
    fontSize: 15,
    color: '#666',
  },
  statusContainer: {
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completed: {
    fontSize: 22,
    color: '#34C759',
    fontWeight: 'bold',
  },
  notCompleted: {
    fontSize: 22,
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 40,
  },
});
