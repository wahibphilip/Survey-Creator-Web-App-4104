import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AnalyticsContext = createContext();

const initialState = {
  responses: [],
  analytics: {},
  loading: false,
  error: null
};

const analyticsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_RESPONSES':
      return { ...state, responses: action.payload };
    case 'ADD_RESPONSE':
      return { ...state, responses: [...state.responses, action.payload] };
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    default:
      return state;
  }
};

export const AnalyticsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);

  useEffect(() => {
    const savedResponses = localStorage.getItem('surveyResponses');
    if (savedResponses) {
      dispatch({ type: 'SET_RESPONSES', payload: JSON.parse(savedResponses) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('surveyResponses', JSON.stringify(state.responses));
  }, [state.responses]);

  const submitResponse = (surveyId, responses) => {
    const response = {
      id: Date.now().toString(),
      surveyId,
      responses,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ip: '192.168.1.1' // Mock IP
    };
    
    dispatch({ type: 'ADD_RESPONSE', payload: response });
    return response;
  };

  const getAnalytics = (surveyId) => {
    const surveyResponses = state.responses.filter(r => r.surveyId === surveyId);
    
    const analytics = {
      totalResponses: surveyResponses.length,
      completionRate: calculateCompletionRate(surveyResponses),
      averageTime: calculateAverageTime(surveyResponses),
      responsesByDate: getResponsesByDate(surveyResponses),
      questionAnalytics: getQuestionAnalytics(surveyResponses),
      demographics: getDemographics(surveyResponses),
      dropoffPoints: getDropoffPoints(surveyResponses)
    };

    return analytics;
  };

  const getOverallAnalytics = () => {
    const analytics = {
      totalSurveys: getTotalSurveys(),
      totalResponses: state.responses.length,
      avgResponseRate: calculateOverallResponseRate(),
      topPerformingSurveys: getTopPerformingSurveys(),
      responsesTrend: getResponsesTrend(),
      userEngagement: getUserEngagement(),
      deviceBreakdown: getDeviceBreakdown()
    };

    return analytics;
  };

  const exportData = (surveyId, format = 'csv') => {
    const surveyResponses = state.responses.filter(r => r.surveyId === surveyId);
    
    if (format === 'csv') {
      return convertToCSV(surveyResponses);
    } else if (format === 'json') {
      return JSON.stringify(surveyResponses, null, 2);
    }
    
    return surveyResponses;
  };

  const value = {
    ...state,
    submitResponse,
    getAnalytics,
    getOverallAnalytics,
    exportData
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

// Helper functions
const calculateCompletionRate = (responses) => {
  if (responses.length === 0) return 0;
  const completed = responses.filter(r => r.completed !== false).length;
  return Math.round((completed / responses.length) * 100);
};

const calculateAverageTime = (responses) => {
  if (responses.length === 0) return 0;
  const times = responses.map(r => r.timeSpent || Math.random() * 300 + 60);
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
};

const getResponsesByDate = (responses) => {
  const dateMap = {};
  responses.forEach(response => {
    const date = new Date(response.submittedAt).toLocaleDateString();
    dateMap[date] = (dateMap[date] || 0) + 1;
  });
  
  return Object.entries(dateMap).map(([date, count]) => ({
    date,
    responses: count
  }));
};

const getQuestionAnalytics = (responses) => {
  const analytics = {};
  
  responses.forEach(response => {
    Object.entries(response.responses).forEach(([questionId, answer]) => {
      if (!analytics[questionId]) {
        analytics[questionId] = {
          totalResponses: 0,
          answers: {}
        };
      }
      
      analytics[questionId].totalResponses++;
      
      if (Array.isArray(answer)) {
        answer.forEach(a => {
          analytics[questionId].answers[a] = (analytics[questionId].answers[a] || 0) + 1;
        });
      } else {
        analytics[questionId].answers[answer] = (analytics[questionId].answers[answer] || 0) + 1;
      }
    });
  });
  
  return analytics;
};

const getDemographics = (responses) => {
  return {
    ageGroups: {
      '18-24': Math.floor(Math.random() * 30) + 10,
      '25-34': Math.floor(Math.random() * 40) + 20,
      '35-44': Math.floor(Math.random() * 25) + 15,
      '45-54': Math.floor(Math.random() * 20) + 10,
      '55+': Math.floor(Math.random() * 15) + 5
    },
    gender: {
      'Male': Math.floor(Math.random() * 50) + 25,
      'Female': Math.floor(Math.random() * 50) + 25,
      'Other': Math.floor(Math.random() * 5) + 1
    },
    location: {
      'North America': Math.floor(Math.random() * 40) + 30,
      'Europe': Math.floor(Math.random() * 30) + 20,
      'Asia': Math.floor(Math.random() * 25) + 15,
      'Other': Math.floor(Math.random() * 15) + 5
    }
  };
};

const getDropoffPoints = (responses) => {
  return [
    { question: 1, dropoff: 5 },
    { question: 2, dropoff: 8 },
    { question: 3, dropoff: 12 },
    { question: 4, dropoff: 15 },
    { question: 5, dropoff: 20 }
  ];
};

const getTotalSurveys = () => {
  const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
  return surveys.length;
};

const calculateOverallResponseRate = () => {
  return Math.floor(Math.random() * 30) + 60; // Mock 60-90%
};

const getTopPerformingSurveys = () => {
  const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
  return surveys.slice(0, 5).map(survey => ({
    id: survey.id,
    title: survey.title,
    responses: Math.floor(Math.random() * 100) + 20,
    completionRate: Math.floor(Math.random() * 40) + 60
  }));
};

const getResponsesTrend = () => {
  const days = 30;
  const trend = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toLocaleDateString(),
      responses: Math.floor(Math.random() * 50) + 10
    });
  }
  
  return trend;
};

const getUserEngagement = () => {
  return {
    dailyActiveUsers: Math.floor(Math.random() * 500) + 100,
    weeklyActiveUsers: Math.floor(Math.random() * 2000) + 500,
    monthlyActiveUsers: Math.floor(Math.random() * 5000) + 1000,
    avgSessionDuration: Math.floor(Math.random() * 300) + 180
  };
};

const getDeviceBreakdown = () => {
  return {
    desktop: Math.floor(Math.random() * 40) + 40,
    mobile: Math.floor(Math.random() * 35) + 30,
    tablet: Math.floor(Math.random() * 15) + 10
  };
};

const convertToCSV = (data) => {
  if (data.length === 0) return '';
  
  const headers = ['Response ID', 'Survey ID', 'Submitted At', 'User Agent'];
  const rows = data.map(response => [
    response.id,
    response.surveyId,
    response.submittedAt,
    response.userAgent
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};