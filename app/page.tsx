'use client';

import { useState } from 'react';
import { Copy, Download, Sparkles, Loader2, CheckCircle } from 'lucide-react';

type Platform = 'twitter' | 'linkedin' | 'email' | 'instagram' | 'facebook';
type Tone = 'professional' | 'casual' | 'enthusiastic' | 'informative' | 'humorous';

export default function Home() {
  const [productDescription, setProductDescription] = useState('');
  const [platform, setPlatform] = useState<Platform>('twitter');
  const [tone, setTone] = useState<Tone>('professional');
  const [variations, setVariations] = useState(3);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const platforms = [
    { id: 'twitter' as Platform, name: 'Twitter/X', icon: '𝕏', color: 'bg-black' },
    { id: 'linkedin' as Platform, name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
    { id: 'email' as Platform, name: 'Email', icon: '📧', color: 'bg-red-600' },
    { id: 'instagram' as Platform, name: 'Instagram', icon: '📷', color: 'bg-pink-600' },
    { id: 'facebook' as Platform, name: 'Facebook', icon: '👥', color: 'bg-blue-600' },
  ];

  const tones = [
    { id: 'professional' as Tone, name: 'Professional', emoji: '💼' },
    { id: 'casual' as Tone, name: 'Casual', emoji: '😊' },
    { id: 'enthusiastic' as Tone, name: 'Enthusiastic', emoji: '🎉' },
    { id: 'informative' as Tone, name: 'Informative', emoji: '📚' },
    { id: 'humorous' as Tone, name: 'Humorous', emoji: '😄' },
  ];

  const handleGenerate = async () => {
    if (!productDescription.trim()) {
      setError('Please enter a product description');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedContent([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productDescription,
          platform,
          tone,
          variations,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data.variations);
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating content');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const exportAsText = () => {
    const text = generatedContent
      .map((content, index) => `Variation ${index + 1}:\n${content}`)
      .join('\n\n---\n\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketing-content-${platform}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-10 h-10 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
              Marketing AI Agent
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Generate compelling marketing content for any platform in seconds
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Claude AI ✨
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Description
                  </label>
                  <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Describe your product, service, or campaign... Include key features, benefits, and target audience."
                    className="w-full h-40 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none transition text-gray-800 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Target Platform
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {platforms.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPlatform(p.id)}
                        className={`px-4 py-3 rounded-lg font-medium transition-all ${
                          platform === p.id
                            ? `${p.color} text-white shadow-lg scale-105`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-2">{p.icon}</span>
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tone
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {tones.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTone(t.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          tone === t.id
                            ? 'bg-purple-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-1">{t.emoji}</span>
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of Variations: {variations}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={variations}
                    onChange={(e) => setVariations(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading || !productDescription.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Content
                    </>
                  )}
                </button>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Generated Content</h2>
                {generatedContent.length > 0 && (
                  <button
                    onClick={exportAsText}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Download className="w-4 h-4" />
                    Export All
                  </button>
                )}
              </div>

              {generatedContent.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Your generated content will appear here</p>
                  <p className="text-sm mt-2">Fill in the details and click Generate Content</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {generatedContent.map((content, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                          Variation {index + 1}
                        </span>
                        <button
                          onClick={() => copyToClipboard(content, index)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                        >
                          {copiedIndex === index ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Footer */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-gray-800 mb-1">Multi-Platform</h3>
            <p className="text-sm text-gray-600">Optimized for Twitter, LinkedIn, Email, Instagram & Facebook</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-bold text-gray-800 mb-1">Tone Control</h3>
            <p className="text-sm text-gray-600">Choose from 5 different tones to match your brand voice</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-bold text-gray-800 mb-1">Powered by Claude</h3>
            <p className="text-sm text-gray-600">Using Anthropic's latest Claude AI for high-quality content</p>
          </div>
        </div>
      </div>
    </div>
  );
}