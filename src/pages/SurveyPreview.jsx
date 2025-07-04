import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSurvey } from '../context/SurveyContext';
import { useAnalytics } from '../context/AnalyticsContext';

const { FiArrowLeft, FiEdit3, FiCheck, FiBarChart3 } = FiIcons;

const SurveyPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSurveyById } = useSurvey();
  const { submitResponse } = useAnalytics();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (id) {
      const surveyData = getSurveyById(id);
      setSurvey(surveyData);
    }
  }, [id, getSurveyById]);

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    
    submitResponse(id, {
      ...responses,
      timeSpent,
      completed: true
    });
    
    alert('Survey response submitted successfully!');
    navigate(`/analytics/${id}`);
  };

  if (!survey) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-600">Survey not found</p>
      </div>
    );
  }

  const renderQuestion = (question) => {
    const response = responses[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={response}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter your answer"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'textarea':
        return (
          <textarea
            value={response}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Enter your answer"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={response === option}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(response) && response.includes(option)}
                  onChange={(e) => {
                    const currentResponses = Array.isArray(response) ? response : [];
                    if (e.target.checked) {
                      handleResponseChange(question.id, [...currentResponses, option]);
                    } else {
                      handleResponseChange(question.id, currentResponses.filter(r => r !== option));
                    }
                  }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleResponseChange(question.id, rating)}
                className={`w-10 h-10 rounded-full border-2 transition-colors ${
                  response === rating
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-600 hover:border-blue-400'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <select
            value={response}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Survey Preview</h1>
            <p className="text-gray-600 mt-1">See how your survey will look to respondents</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/analytics/${id}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiBarChart3} />
            <span>View Analytics</span>
          </button>
          <button
            onClick={() => navigate(`/edit/${id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiEdit3} />
            <span>Edit Survey</span>
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{survey.title}</h2>
          {survey.description && (
            <p className="text-gray-600 text-lg">{survey.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {survey.questions?.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 border border-gray-200 rounded-lg"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {index + 1}. {question.title}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
                {question.description && (
                  <p className="text-gray-600">{question.description}</p>
                )}
              </div>
              
              {renderQuestion(question)}
            </motion.div>
          ))}

          {survey.questions?.length > 0 && (
            <div className="text-center pt-8">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <SafeIcon icon={FiCheck} />
                <span>Submit Survey</span>
              </button>
            </div>
          )}

          {survey.questions?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No questions added yet. Add some questions to see the preview.</p>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default SurveyPreview;