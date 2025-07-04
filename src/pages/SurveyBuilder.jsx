import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (id) {
      const survey = getSurveyById(id);
      if (survey) {
        setCurrentSurvey(survey);
        setSurveyTitle(survey.title);
        setSurveyDescription(survey.description || '');
      }
    } else {
      setCurrentSurvey(null);
      setSurveyTitle('');
      setSurveyDescription('');
    }
  }, [id, getSurveyById, setCurrentSurvey]);

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
      updateSurvey({ ...currentSurvey, ...surveyData });
    } else {
      const newSurvey = createSurvey(surveyData);
      navigate(`/edit/${newSurvey.id}`);
    }
  };

  const handlePreview = () => {
    if (currentSurvey) {
      navigate(`/preview/${currentSurvey.id}`);
    }
  };

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
            disabled={!currentSurvey}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
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
                  onChange={(e) => setSurveyTitle(e.target.value)}
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
                  onChange={(e) => setSurveyDescription(e.target.value)}
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
    </div>
  );
};

export default SurveyBuilder;