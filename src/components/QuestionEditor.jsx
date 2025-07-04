import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSurvey } from '../context/SurveyContext';

const { FiPlus, FiX } = FiIcons;

const QuestionEditor = () => {
  const { addQuestion } = useSurvey();
  const [questionData, setQuestionData] = useState({
    title: '',
    description: '',
    type: 'text',
    required: false,
    options: ['']
  });

  const questionTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'multiple-choice', label: 'Multiple Choice' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'rating', label: 'Rating Scale' }
  ];

  const handleAddQuestion = () => {
    if (!questionData.title.trim()) {
      alert('Please enter a question title');
      return;
    }

    const questionToAdd = {
      ...questionData,
      options: ['multiple-choice', 'checkbox', 'dropdown'].includes(questionData.type)
        ? questionData.options.filter(opt => opt.trim())
        : undefined
    };

    addQuestion(questionToAdd);
    setQuestionData({
      title: '',
      description: '',
      type: 'text',
      required: false,
      options: ['']
    });
  };

  const handleAddOption = () => {
    setQuestionData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleRemoveOption = (index) => {
    setQuestionData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleOptionChange = (index, value) => {
    setQuestionData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const needsOptions = ['multiple-choice', 'checkbox', 'dropdown'].includes(questionData.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Question</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Title *
          </label>
          <input
            type="text"
            value={questionData.title}
            onChange={(e) => setQuestionData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter question title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={questionData.description}
            onChange={(e) => setQuestionData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter question description"
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Type
          </label>
          <select
            value={questionData.type}
            onChange={(e) => setQuestionData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {questionTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {needsOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {questionData.options.map((option, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {questionData.options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
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
                <SafeIcon icon={FiPlus} className="text-xs" />
                <span>Add Option</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="required"
            checked={questionData.required}
            onChange={(e) => setQuestionData(prev => ({ ...prev, required: e.target.checked }))}
            className="text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="required" className="text-sm text-gray-700">
            Required question
          </label>
        </div>

        <button
          onClick={handleAddQuestion}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Add Question</span>
        </button>
      </div>
    </motion.div>
  );
};

export default QuestionEditor;