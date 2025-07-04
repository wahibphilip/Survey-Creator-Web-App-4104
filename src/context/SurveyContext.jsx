import React, { createContext, useContext, useReducer, useEffect } from 'react';

const SurveyContext = createContext();

const initialState = {
  surveys: [],
  currentSurvey: null,
  loading: false,
  error: null
};

const surveyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SURVEYS':
      return { ...state, surveys: action.payload };
    case 'SET_CURRENT_SURVEY':
      return { ...state, currentSurvey: action.payload };
    case 'ADD_SURVEY':
      return { 
        ...state, 
        surveys: [...state.surveys, action.payload],
        currentSurvey: action.payload
      };
    case 'UPDATE_SURVEY':
      return {
        ...state,
        surveys: state.surveys.map(survey =>
          survey.id === action.payload.id ? action.payload : survey
        ),
        currentSurvey: action.payload
      };
    case 'DELETE_SURVEY':
      return {
        ...state,
        surveys: state.surveys.filter(survey => survey.id !== action.payload)
      };
    case 'ADD_QUESTION':
      if (!state.currentSurvey) return state;
      const updatedSurvey = {
        ...state.currentSurvey,
        questions: [...state.currentSurvey.questions, action.payload]
      };
      return {
        ...state,
        currentSurvey: updatedSurvey,
        surveys: state.surveys.map(survey =>
          survey.id === updatedSurvey.id ? updatedSurvey : survey
        )
      };
    case 'UPDATE_QUESTION':
      if (!state.currentSurvey) return state;
      const surveyWithUpdatedQuestion = {
        ...state.currentSurvey,
        questions: state.currentSurvey.questions.map(q =>
          q.id === action.payload.id ? action.payload : q
        )
      };
      return {
        ...state,
        currentSurvey: surveyWithUpdatedQuestion,
        surveys: state.surveys.map(survey =>
          survey.id === surveyWithUpdatedQuestion.id ? surveyWithUpdatedQuestion : survey
        )
      };
    case 'DELETE_QUESTION':
      if (!state.currentSurvey) return state;
      const surveyWithDeletedQuestion = {
        ...state.currentSurvey,
        questions: state.currentSurvey.questions.filter(q => q.id !== action.payload)
      };
      return {
        ...state,
        currentSurvey: surveyWithDeletedQuestion,
        surveys: state.surveys.map(survey =>
          survey.id === surveyWithDeletedQuestion.id ? surveyWithDeletedQuestion : survey
        )
      };
    default:
      return state;
  }
};

export const SurveyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(surveyReducer, initialState);

  useEffect(() => {
    const savedSurveys = localStorage.getItem('surveys');
    if (savedSurveys) {
      dispatch({ type: 'SET_SURVEYS', payload: JSON.parse(savedSurveys) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('surveys', JSON.stringify(state.surveys));
  }, [state.surveys]);

  const createSurvey = (surveyData) => {
    const newSurvey = {
      id: Date.now().toString(),
      ...surveyData,
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_SURVEY', payload: newSurvey });
    return newSurvey;
  };

  const updateSurvey = (surveyData) => {
    const updatedSurvey = {
      ...surveyData,
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'UPDATE_SURVEY', payload: updatedSurvey });
  };

  const deleteSurvey = (surveyId) => {
    dispatch({ type: 'DELETE_SURVEY', payload: surveyId });
  };

  const getSurveyById = (id) => {
    return state.surveys.find(survey => survey.id === id);
  };

  const addQuestion = (question) => {
    const newQuestion = {
      id: Date.now().toString(),
      ...question,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_QUESTION', payload: newQuestion });
  };

  const updateQuestion = (question) => {
    dispatch({ type: 'UPDATE_QUESTION', payload: question });
  };

  const deleteQuestion = (questionId) => {
    dispatch({ type: 'DELETE_QUESTION', payload: questionId });
  };

  const setCurrentSurvey = (survey) => {
    dispatch({ type: 'SET_CURRENT_SURVEY', payload: survey });
  };

  const value = {
    ...state,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    getSurveyById,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setCurrentSurvey
  };

  return (
    <SurveyContext.Provider value={value}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};