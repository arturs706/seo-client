"use client"

import React, { useState } from 'react';
import { Search, Globe, Gauge, Code, Link, BarChart2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetaInfo {
  title: string;
  description: string;
}

interface PageSpeedMetrics {
  first_contentful_paint: number;
  speed_index: number;
  largest_contentful_paint: number;
  time_to_interactive: number;
}

interface ContentQualityMetrics {
  image_count: number;
  internal_links: number;
  external_links: number;
}

interface TechnicalSEO {
  page_speed_metrics: PageSpeedMetrics;
  mobile_friendly: boolean;
  ssl_status: boolean;
  response_time: number;
}

interface ContentAnalysis {
  word_count: number;
  readability_score: number;
  content_quality_metrics: ContentQualityMetrics;
}

interface AnalysisResults {
  meta_info: MetaInfo;
  technical_seo: TechnicalSEO;
  content_analysis: ContentAnalysis;
}

const SEOAnalyzer: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string>('');

  const analyzeWebsite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8080/api/seo/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      if (!response.ok) throw new Error('Analysis failed');
      
      const data: AnalysisResults = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to analyze website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatMetric = (value: number | string): string => {
    return typeof value === 'number' ? value.toFixed(2) : value.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Website SEO Analyzer</h1>
        
        <form onSubmit={analyzeWebsite} className="mb-8">
          <div className="flex gap-4">
            <input
              type="url"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
              placeholder="Enter website URL"
              required
              className="flex-1 p-3 border rounded-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Analyzing...' : <>Analyze <Search size={20} /></>}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {results && (
          <div className="space-y-6">
            {/* Meta Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe /> Meta Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Title</h3>
                  <p className="text-gray-600">{results.meta_info.title}</p>
                </div>
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p className="text-gray-600">{results.meta_info.description}</p>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Gauge /> Performance Metrics
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      {
                        name: 'FCP',
                        value: results.technical_seo.page_speed_metrics.first_contentful_paint
                      },
                      {
                        name: 'SI',
                        value: results.technical_seo.page_speed_metrics.speed_index
                      },
                      {
                        name: 'LCP',
                        value: results.technical_seo.page_speed_metrics.largest_contentful_paint
                      },
                      {
                        name: 'TTI',
                        value: results.technical_seo.page_speed_metrics.time_to_interactive
                      }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#2563eb" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Content Analysis */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Code /> Content Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium">Word Count</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.content_analysis.word_count}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Readability Score</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatMetric(results.content_analysis.readability_score)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Image Count</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.content_analysis.content_quality_metrics.image_count}
                  </p>
                </div>
              </div>
            </div>

            {/* Links Analysis */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Link /> Links Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Internal Links</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.content_analysis.content_quality_metrics.internal_links}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">External Links</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.content_analysis.content_quality_metrics.external_links}
                  </p>
                </div>
              </div>
            </div>

            {/* Technical SEO */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart2 /> Technical SEO
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium">Mobile Friendly</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.technical_seo.mobile_friendly ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">SSL Status</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {results.technical_seo.ssl_status ? 'Valid' : 'Invalid'}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Response Time</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatMetric(results.technical_seo.response_time)}s
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SEOAnalyzer;