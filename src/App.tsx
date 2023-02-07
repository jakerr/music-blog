import React, { lazy, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
const MajorModesTutorial = lazy(() => import("./MajorModesTutorial"));
const MajorModesExplorer = lazy(() => import("./MajorModesExplorer"));

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}


function NotFoundPage() {
  return (
    <div>
      <h1>404 Not Found</h1>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <Suspense fallback={<div>...</div>}>
        <Router>
          <Routes>
            <Route path="/" element={<MajorModesTutorial/>}></Route>
            <Route path="/modes-explorer" element={<MajorModesExplorer/>}></Route>
            <Route path='*' element={<NotFoundPage />}/>
          </Routes>
        </Router>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
