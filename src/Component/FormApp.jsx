import React, { createContext, useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';


const TodoContext = createContext();
const AuthContext = createContext();


const TodoContextProvider = ({ children }) => {
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos')) || []);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('todos', JSON.stringify(todos)); 
    }
  }, [todos, user]);

  const addTodo = (task, priority, dueDateTime) => {
    setTodos([...todos, { id: Date.now(), task, priority, dueDateTime, completed: false }]);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const signup = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('todos');
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, toggleComplete, deleteTodo }}>
      <AuthContext.Provider value={{ user, signup, login, logout }}>
        {children}
      </AuthContext.Provider>
    </TodoContext.Provider>
  );
};

const useTodos = () => useContext(TodoContext);
const useAuth = () => useContext(AuthContext);


const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    if (email && password && name) {
      signup({ email, name, password });
      navigate('/login');
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="bg-[#003366] bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <input
            className="w-full p-4 mb-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#003366]"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full p-4 mb-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#003366]"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-4 mb-6 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#003366]"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full py-3 bg-[#003366] text-white font-semibold rounded-xl hover:bg-[#002244] transition"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email === email && storedUser.password === password) {
      login(storedUser);
      navigate('/todo');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="bg-[#003366] bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            className="w-full p-4 mb-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#003366]"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-4 mb-6 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#003366]"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full py-3 bg-[#003366] text-white font-semibold rounded-xl hover:bg-[#002244] transition"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};


const FormApp = () => {
  const { todos, addTodo, toggleComplete, deleteTodo } = useTodos();
  const { user, logout } = useAuth();
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('Low');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');

  const handleAddTask = () => {
    if (task.trim()) {
      const dueDateTime = dueDate && dueTime ? `${dueDate} ${dueTime}` : dueDate || 'No Due Date';
      addTodo(task, priority, dueDateTime);
      setTask('');
      setPriority('Low');
      setDueDate('');
      setDueTime('');
    }
  };

  if (!user) {
    return <Login />; 
  }

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col items-center">
      <div className="absolute top-5 left-5 text-2xl font-semibold text-[#003366]">
        Welcome, {user.name}
      </div>
      <button
        onClick={logout}
        className="absolute top-5 right-5 bg-[#003366] text-white p-3 rounded-full hover:bg-red-700"
      >
        Logout
      </button>
      <div className="bg-white p-10 mt-20 shadow-xl rounded-xl w-full max-w-lg space-y-8">
        <h1 className="text-4xl font-bold text-center text-[#003366]">To-Do App</h1>
        <div className="space-y-4">
          <input
            className="w-full p-4 bg-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#003366]"
            type="text"
            placeholder="Enter your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <div className="flex space-x-4">
            <select
              className="w-1/3 p-4 bg-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#003366]"
              value={priority}
              type="text"
             placeholder="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <input
              className="w-1/3 p-4 bg-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#003366]"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <input
              className="w-1/3 p-4 bg-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#003366]"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
            />
          </div>
          <button
            className="w-full py-4 bg-[#003366] text-white font-semibold rounded-xl hover:bg-[#002244] transition"
            onClick={handleAddTask}
          >
            Add Task
          </button>
        </div>
      </div>

      <ul className="mt-8 w-full max-w-lg space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`flex flex-col items-start bg-[#003366] p-6 my-4 shadow-xl rounded-xl ${
              todo.completed ? 'line-through text-gray-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <p className="text-xl font-semibold text-white">{todo.task}</p>
              <span className="ml-2 text-sm text-teal-200 italic font-bold">Priority {todo.priority} </span>
            </div> <br />
            <small className="text-white">Due: {todo.dueDateTime || 'No Due Date'}</small>
            <div className="mt-4 flex space-x-40 flex justify-between mt-6">
              <button
                className="text-green-600 hover:text-green-700 size-5"
                onClick={() => toggleComplete(todo.id)}
              >
                
               Complete <CheckIcon className="h-6 w-6" />
              </button>
              <button
                className="text-red-600 hover:text-red-700"
                onClick={() => deleteTodo(todo.id)}
              >
               Delete <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => (
  <TodoContextProvider>
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/todo" element={<FormApp />} />
      </Routes>
    </Router>
  </TodoContextProvider>
);

export default App;
