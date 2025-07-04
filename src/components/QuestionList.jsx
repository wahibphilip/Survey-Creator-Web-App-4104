import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSurvey } from '../context/SurveyContext';

const { FiEdit3, FiTrash2, FiMove, FiCheck, FiX } = FiIcons;

const QuestionList = () => {
  const { currentSurvey, updateQuestion, deleteQuestion } = useSurvey();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editData, setEditData] = useState({});

  const questions = currentSurvey?.questions || [];

  const handleEditQuestion = (question) => {
    setEditingQuestion(question.id);
    setEditData({
      title: question.title,
      description: question.description || '',
      required: question.required,
      options: question.options || ['']
    });
  };

  const handleSaveEdit = () => {
    const questionToUpdate = {
      ...questions.find(q => q.id === editingQuestion),
      ...editData,
      options: ['multiple-choice', 'checkbox', 'dropdown'].includes(
        questions.find(q => q.id === editingQuestion)?.type
      ) ? editData.options.filter(opt => opt.trim()) : undefined
    };

    updateQuestion(questionToUpdate);
    setEditingQuestion(null);
    setEditData({});
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditData({});
  };

  const handleDeleteQuestion = (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(questionId);
    }
  };

  const handleAddOption = () => {
    setEditData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    setEditData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (index, value) => {
    setEditData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      'text': 'Text Input',
      'textarea': 'Long Text',
      'multiple-choice': 'Multiple Choice',
      'checkbox': 'Checkboxes',
      'dropdown': 'Dropdown',
      'rating': 'Rating Scale'
    };
    return types[type] || type;
  };

  if (questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <p className="text-gray-500">No questions added yet. Use the form on the right to add your first question.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Questions ({questions.length})</h2>
      
      <div className="space-y-4">
        <AnimatePresence>
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {editingQuestion === question.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Title *
                    </label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {['multiple-choice', 'checkbox', 'dropdown'].includes(question.type) && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {editData.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex space-x-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {editData.options.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOption(optionIndex)}
                                className="text-red-600 hover:text-red-700 p-2"
                              >
                                <SafeIcon icon={FiX} />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={handleAddOption}
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                        >
                          <SafeIcon icon={FiMove} className="text-xs" />
                          <span>Add Option</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`required-${question.id}`}
                      checked={editData.required}
                      onChange={(e) => setEditData(prev => ({ ...prev, required: e.target.checked }))}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
                      Required question
                    </label>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <SafeIcon icon={FiCheck} className="text-xs" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                    >
                      <SafeIcon icon={FiX} className="text-xs" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {getQuestionTypeLabel(question.type)}
                        </span>
                        {question.required && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900">{question.title}</h3>
                      {question.description && (
                        <p className="text-gray-600 text-sm mt-1">{question.description}</p>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="text-blue-600 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                      >
                        <SafeIcon icon={FiEdit3} className="text-sm" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50"
                      >
                        <SafeIcon icon={FiTrash2} className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {question.options && question.options.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Options:</p>
                      <div className="space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="text-sm text-gray-700">
                            • {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuestionList;