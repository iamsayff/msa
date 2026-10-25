import { useState, useEffect } from 'react';

export type RouteType = 
  | { name: 'home' }
  | { name: 'candidates'; category?: string }
  | { name: 'candidate_profile'; candidateId: string }
  | { name: 'edit_candidate'; candidateId: string }
  | { name: 'admin' }
  | { name: 'vote' }
  | { name: 'issues' }
  | { name: 'timeline' }
  | { name: 'manifesto' }
  | { name: 'news' }
  | { name: 'about' }
  | { name: 'privacy' }
  | { name: 'guidelines' }
  | { name: 'support' }
  | { name: 'profile' };

export function parseRoute(pathname: string): RouteType {
  const clean = pathname.replace(/\/+$/, '') || '/';

  if (clean === '/' || clean === '') {
    return { name: 'home' };
  }
  if (clean === '/admin' || clean === '/admin-panel' || clean === '/control-room') {
    return { name: 'admin' };
  }
  if (clean === '/candidates') {
    return { name: 'candidates' };
  }
  if (clean.startsWith('/candidate/') && clean.endsWith('/edit')) {
    const candidateId = clean.replace('/candidate/', '').replace(/\/edit$/, '');
    return { name: 'edit_candidate', candidateId };
  }
  if (clean.startsWith('/edit-candidate/')) {
    const candidateId = clean.replace('/edit-candidate/', '');
    return { name: 'edit_candidate', candidateId };
  }
  if (clean.startsWith('/candidate/')) {
    const candidateId = clean.replace('/candidate/', '');
    return { name: 'candidate_profile', candidateId };
  }
  if (clean.endsWith('-profile')) {
    // e.g. /ayaan-khan-profile or /pres-1-profile
    const candidateId = clean.replace(/^\//, '').replace(/-profile$/, '');
    return { name: 'candidate_profile', candidateId };
  }
  if (clean === '/vote' || clean === '/ballot') {
    return { name: 'vote' };
  }
  if (clean === '/issues') {
    return { name: 'issues' };
  }
  if (clean === '/timeline') {
    return { name: 'timeline' };
  }
  if (clean === '/manifesto') {
    return { name: 'manifesto' };
  }
  if (clean === '/news') {
    return { name: 'news' };
  }
  if (clean === '/about') {
    return { name: 'about' };
  }
  if (clean === '/privacy' || clean === '/privacy-policy') {
    return { name: 'privacy' };
  }
  if (clean === '/guidelines' || clean === '/community-guidelines') {
    return { name: 'guidelines' };
  }
  if (clean === '/support' || clean === '/contact-support' || clean === '/help') {
    return { name: 'support' };
  }
  if (clean === '/profile' || clean === '/voter-profile') {
    return { name: 'profile' };
  }

  return { name: 'home' };
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Check if loaded via 404.html redirect query parameter (e.g. /?p=/candidate/pres-1)
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p) {
      // Clean up URL back to clean path without query params
      window.history.replaceState({}, '', p);
      return p;
    }
    // Also support legacy ?/path format
    const search = window.location.search;
    if (search && search.startsWith('?/')) {
      const decodedPath = decodeURIComponent(search.slice(2).split('&')[0]);
      window.history.replaceState({}, '', decodedPath);
      return decodedPath;
    }
    return window.location.pathname;
  });

  const route = parseRoute(currentPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (toPath: string) => {
    if (window.location.pathname !== toPath) {
      window.history.pushState({}, '', toPath);
      setCurrentPath(toPath);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    pathname: currentPath,
    route,
    navigate,
  };
}
