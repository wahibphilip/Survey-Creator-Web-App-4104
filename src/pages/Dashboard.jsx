import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSurvey } from '../context/SurveyContext';

const { FiPlus, FiEdit3, FiEye, FiTrash2, FiCalendar, FiHelpCircle } = FiIcons;

const Dashboard = () => {
  const { surveys, deleteSurvey } = useSurvey();

  const handleDeleteSurvey = (surveyId) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      deleteSurvey(surveyId);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Survey Dashboard</h1>
          <p className="text-gray-600 mt-2">Create and manage your surveys</p>
        </div>
        <Link
          to="/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
        >
          <SafeIcon icon={FiPlus} />
          <span>Create Survey</span>
        </Link>
      </div>

      {surveys.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <SafeIcon icon={FiHelpCircle} className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No surveys yet</h2>
          <p className="text-gray-500 mb-8">Create your first survey to get started</p>
          <Link
            to="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiPlus} />
            <span>Create Your First Survey</span>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {surveys.map((survey) => (
            <motion.div
              key={survey.id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 truncate">
                    {survey.title}
                  </h3>
                  <div className="flex space-x-2">
                    <Link
                      to={`/edit/${survey.id}`}
                      className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <SafeIcon icon={FiEdit3} />
                    </Link>
                    <Link
                      to={`/preview/${survey.id}`}
                      className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <SafeIcon icon={FiEye} />
                    </Link>
                    <button
                      onClick={() => handleDeleteSurvey(survey.id)}
                      className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {survey.description || 'No description provided'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiHelpCircle} className="text-xs" />
                    <span>{survey.questions?.length || 0} questions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiCalendar} className="text-xs" />
                    <span>{format(new Date(survey.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Updated {format(new Date(survey.updatedAt), 'MMM d')}
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      to={`/edit/${survey.id}`}
                      className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/preview/${survey.id}`}
                      className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                    >
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;