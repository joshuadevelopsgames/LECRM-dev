import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TutorialContext = createContext();

export function TutorialProvider({ children }) {
  const [isTutorialMode, setIsTutorialMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Map routes to tutorial steps
  const routeToStepMap = {
    '/dashboard': 1,
    '/': 1,
    '/accounts': 2,
    '/account-detail': 3,
    '/scoring': 4,
    '/tasks': 6,
    '/sequences': 7,
    '/contacts': 2, // Contacts uses same step as Accounts
  };

  // Check URL params for tutorial mode and auto-advance based on route
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tutorialStep = params.get('tutorial');
    const stepParam = params.get('step');
    
    if (location.pathname === '/tutorial') {
      setIsTutorialMode(true);
      if (stepParam !== null) {
        const step = parseInt(stepParam) || 0;
        setCurrentStep(step);
      }
    } else if (tutorialStep !== null) {
      // Manual tutorial step from URL param
      setIsTutorialMode(true);
      const step = parseInt(tutorialStep) || 0;
      setCurrentStep(step);
    } else if (isTutorialMode && location.pathname !== '/tutorial') {
      // Auto-advance based on current route when navigating while in tutorial mode
      const mappedStep = routeToStepMap[location.pathname];
      if (mappedStep !== undefined) {
        setCurrentStep(mappedStep);
      }
    } else if (location.pathname !== '/tutorial' && !tutorialStep) {
      // Exit tutorial mode if no tutorial params and not on tutorial page
      setIsTutorialMode(false);
    }
  }, [location.pathname, location.search]);

  const startTutorial = (step = 0) => {
    setIsTutorialMode(true);
    setCurrentStep(step);
  };

  const exitTutorial = () => {
    setIsTutorialMode(false);
    setCurrentStep(0);
    setHighlightedElement(null);
    // Remove tutorial param from URL
    const params = new URLSearchParams(location.search);
    params.delete('tutorial');
    const newUrl = params.toString() 
      ? `${location.pathname}?${params.toString()}`
      : location.pathname;
    navigate(newUrl, { replace: true });
  };

  const goToTutorialStep = (step) => {
    setCurrentStep(step);
    navigate(`/tutorial?step=${step}`, { replace: true });
  };

  const navigateWithTutorial = (path, step) => {
    navigate(`${path}?tutorial=${step}`);
  };

  return (
    <TutorialContext.Provider
      value={{
        isTutorialMode,
        currentStep,
        setCurrentStep,
        highlightedElement,
        setHighlightedElement,
        startTutorial,
        exitTutorial,
        goToTutorialStep,
        navigateWithTutorial
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
}

