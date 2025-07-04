import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useSurvey } from '../context/SurveyContext';
import QuestionEditor from '../components/QuestionEditor';
import QuestionList from '../components/QuestionList';

const { FiSave, FiEye, FiArrowLeft, FiSettings } = FiIcons;

const SurveyBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentSurvey, setCurrentSurvey, getSurveyById, createSurvey, updateSurvey } = useSurvey();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only run this effect once when the component mounts or ID changes
    if (!initializedRef.current) {
      initializedRef.current = true;
      
      if (id) {
        // Editing existing survey
        const survey = getSurveyById(id);
        if (survey) {
          setCurrentSurvey(survey);
          setSurveyTitle(survey.title || '');
          setSurveyDescription(survey.description || '');
        }
      } else {
        // Creating new survey
        setCurrentSurvey(null);
        setSurveyTitle('');
        setSurveyDescription('');
      }
      
      setIsInitialized(true);
    }
  }, [id]); // Only depend on ID changes

  const handleSaveSurvey = () => {
    if (!surveyTitle.trim()) {
      alert('Please enter a survey title');
      return;
    }

    const surveyData = {
      title: surveyTitle,
      description: surveyDescription,
      questions: currentSurvey?.questions || []
    };

    if (id && currentSurvey) {
      // Update existing survey
      const updatedSurvey = { ...currentSurvey, ...surveyData };
      updateSurvey(updatedSurvey);
      setCurrentSurvey(updatedSurvey);
    } else {
      // Create new survey
      const newSurvey = createSurvey(surveyData);
      setCurrentSurvey(newSurvey);
      navigate(`/edit/${newSurvey.id}`);
    }
  };

  const handlePreview = () => {
    if (currentSurvey) {
      navigate(`/preview/${currentSurvey.id}`);
    } else {
      alert('Please save the survey first');
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setSurveyTitle(newTitle);
    
    // Update current survey if it exists
    if (currentSurvey) {
      const updatedSurvey = { ...currentSurvey, title: newTitle };
      setCurrentSurvey(updatedSurvey);
    }
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setSurveyDescription(newDescription);
    
    // Update current survey if it exists
    if (currentSurvey) {
      const updatedSurvey = { ...currentSurvey, description: newDescription };
      setCurrentSurvey(updatedSurvey);
    }
  };

  // Don't render until initialized to prevent flash
  if (!isInitialized) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Edit Survey' : 'Create Survey'}
            </h1>
            <p className="text-gray-600 mt-1">Build your survey with custom questions</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiSettings} />
            <span>Settings</span>
          </button>
          <button
            onClick={handlePreview}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiEye} />
            <span>Preview</span>
          </button>
          <button
            onClick={handleSaveSurvey}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <SafeIcon icon={FiSave} />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Survey Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Title *
                </label>
                <input
                  type="text"
                  value={surveyTitle}
                  onChange={handleTitleChange}
                  placeholder="Enter survey title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={surveyDescription}
                  onChange={handleDescriptionChange}
                  placeholder="Enter survey description"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>
          <QuestionList />
        </div>
        <div className="lg:col-span-1">
          <QuestionEditor />
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Survey Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Survey Status
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allow Anonymous Responses
                </label>
                <input
                  type="checkbox"
                  className="text-blue-600 focus:ring-blue-500"
                  defaultChecked
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Limit
                </label>
                <input
                  type="number"
                  placeholder="No limit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SurveyBuilder;