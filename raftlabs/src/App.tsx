import React, { useEffect, useState } from 'react';
import { Avatar, List, Button, DatePicker, Form, Input, Space, message, Select, Popconfirm } from 'antd';
import { MinusCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

// Define the Task type for TypeScript
interface Task {
  _id: string;
  taskName: string;
  due_date: string;
  priority: string;
  status: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // State to store task list
  const [form] = Form.useForm(); // Create a form instance
  const [editingTask, setEditingTask] = useState<Task | null>(null); // State for the task being edited
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for the search term

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/task/getAllTask');
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Failed to fetch tasks. Please try again.');
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to handle search
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/task/search?taskName=${searchTerm}`);
      setTasks(response.data.tasks); // Update task list with search results
    } catch (error) {
      console.error('Error searching tasks:', error);
      message.error('Failed to search tasks. Please try again.');
    }
  };

  // Function to handle form submission and make the API request
  const onFinish = async (values: any) => {
    try {
      const taskData = {
        taskName: values.tasks[0].taskName,
        due_date: values.tasks[0].due_date.format('YYYY-MM-DD'),
        priority: values.tasks[0].priority,
        status: values.tasks[0].status,
      };

      if (editingTask) {
        await axios.put(`http://localhost:4000/api/v1/task/update/${editingTask._id}`, taskData);
        message.success('Task updated successfully!');
      } else {
        await axios.post('http://localhost:4000/api/v1/task/post', taskData);
        message.success('Task added successfully!');
      }

      form.resetFields();
      setEditingTask(null);
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error adding/updating tasks:', error);
      message.error('Failed to add/update tasks. Please try again.');
    }
  };

  // Function to delete a task
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/task/delete/${id}`);
      message.success('Task deleted successfully!');
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error deleting task:', error);
      message.error('Failed to delete task. Please try again.');
    }
  };

  // Function to start editing a task
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      tasks: [{
        taskName: task.taskName,
        due_date: moment(task.due_date),
        priority: task.priority,
        status: task.status,
      }],
    });
  };

  return (
    <>
      <Navbar/>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}> 
        {/* Search Section */}
        <Space style={{ marginBottom: 20 }}>
          <Input
            placeholder="Search Task"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
        </Space>

        <List
          itemLayout="horizontal"
          dataSource={tasks}
          style={{ width: '100%', maxWidth: 600, marginBottom: 20 }}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button icon={<EditOutlined />} onClick={() => handleEdit(item)}>Edit</Button>,
                <Popconfirm title="Are you sure to delete this task?" onConfirm={() => handleDelete(item._id)}>
                  <Button icon={<DeleteOutlined />} danger>Delete</Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={`https://api.dicebear.com/7.x/initials/svg?seed=${index}`} />}
                title={<a href="#">{item.taskName}</a>}
                description={`Due Date: ${item.due_date}, Priority: ${item.priority}, Status: ${item.status}`}
              />
            </List.Item>
          )}
        />

        {/* Add/Edit Task Form */}
        <Form
          form={form}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          autoComplete="off"
          initialValues={{
            tasks: [{}],
          }}
        >
          <Form.List name="tasks">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'taskName']}
                      rules={[{ required: true, message: 'Please input the task name!' }]}
                    >
                      <Input placeholder="Task Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'due_date']}
                      rules={[{ required: true, message: 'Please select a due date!' }]}
                    >
                      <DatePicker />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'priority']}
                      rules={[{ required: true, message: 'Please select a priority!' }]}
                    >
                      <Select placeholder="Select Priority">
                        <Select.Option value="Higher Priority">Higher Priority</Select.Option>
                        <Select.Option value="Less Priority">Less Priority</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'status']}
                      rules={[{ required: true, message: 'Please select a status!' }]}
                    >
                      <Select placeholder="Select Status">
                        <Select.Option value="In Progress">In-progress</Select.Option>
                        <Select.Option value="Completed">Completed</Select.Option>
                      </Select>
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Task
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTask ? 'Update Task' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Footer/>
    </>
  );
};

export default App;
