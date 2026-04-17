import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * LegacyRedirect Helper Component
 * Redirects old route paths to new routes, with parameter substitution
 * 
 * Example:
 *   <Route path="/kingdom/:id/speed" element={<LegacyRedirect template="/subjects/math-kingdom/multiplication-kingdom/:id/speed" />} />
 * 
 * When user visits /kingdom/3/speed:
 * - Captures params: { id: '3' }
 * - Substitutes :id in template → /subjects/math-kingdom/multiplication-kingdom/3/speed
 * - Navigates to new route
 */
export default function LegacyRedirect({ template }) {
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    // Substitute all :param with actual values
    let newPath = template;
    Object.entries(params).forEach(([key, value]) => {
      newPath = newPath.replace(`:${key}`, value);
    });
    
    // Navigate to the new path with replace to prevent back button issues
    navigate(newPath, { replace: true });
  }, [params, template, navigate]);

  return null; // This component only handles redirection
}
