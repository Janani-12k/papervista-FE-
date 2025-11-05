import { useState, useEffect } from 'react';
import { Search, Filter, Download, ExternalLink, Lock, Unlock, FileText } from 'lucide-react';
import PaperCard from '../components/PaperCard';
import SearchFilters from '../components/SearchFilters';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    yearRange: [2020, 2024],
    categories: [],
    accessType: 'all'
  });
  const [selectedPapers, setSelectedPapers] = useState([]);

  // Mock data for demonstration - Multi-tiered access system
  const mockPapers = [
    {
      id: '1',
      title: 'Deep Learning Approaches for Natural Language Processing in Academic Research',
      authors: ['John Smith', 'Jane Doe', 'Michael Johnson'],
      journal: 'Journal of AI Research',
      year: 2024,
      abstract: 'This paper presents novel deep learning methodologies for processing academic texts, focusing on transformer architectures and their applications in research paper analysis. We introduce a new attention mechanism that significantly improves performance on academic text understanding tasks.',
      accessType: 'unlocked',
      pdfUrl: 'https://example.com/paper1.pdf',
      doi: '10.1000/182',
      citations: 45,
      summary: 'A comprehensive study on applying transformer architectures to academic text analysis with 95% accuracy improvement over baseline methods.',
      justification: 'High-impact open access paper providing foundational methodology for AI-powered research tools.'
    },
    {
      id: '2',
      title: 'Machine Learning Applications in Scientific Literature Mining',
      authors: ['Alice Brown', 'Bob Wilson'],
      journal: 'IEEE Transactions on Knowledge and Data Engineering',
      year: 2023,
      abstract: 'This work explores machine learning techniques for extracting insights from scientific literature, employing ensemble learning methods and advanced feature extraction. The study demonstrates significant improvements in automated literature analysis.',
      accessType: 'preprint',
      preprintUrl: 'https://arxiv.org/abs/2023.12345',
      doi: '10.1109/TKDE.2023.1234567',
      citations: 32,
      summary: 'An innovative approach to literature mining using ensemble learning methods with 88% accuracy in topic classification.',
      justification: 'Preprint provides early access to cutting-edge literature mining techniques before formal publication.'
    },
    {
      id: '3',
      title: 'Advanced Text Processing for Research Paper Analysis',
      authors: ['Carol Davis', 'David Miller'],
      journal: 'Nature Machine Intelligence',
      year: 2024,
      abstract: 'We present a new framework for analyzing research papers using advanced NLP techniques, focusing on semantic understanding and knowledge extraction. The framework shows remarkable performance in automated research analysis.',
      accessType: 'locked',
      doi: '10.1038/s42256-024-00123-4',
      citations: 28,
      summary: 'A breakthrough in automated research paper analysis with 95% accuracy in semantic understanding tasks.',
      justification: 'High-impact locked paper from prestigious journal, requires alternative access through library or institutional subscription.'
    },
    {
      id: '4',
      title: 'Semantic Analysis of Academic Publications Using Graph Neural Networks',
      authors: ['Eva Garcia', 'Frank Lee'],
      journal: 'Proceedings of the 2024 Conference on Empirical Methods in Natural Language Processing',
      year: 2024,
      abstract: 'This paper introduces a novel graph-based approach to understanding academic paper relationships, employing graph neural networks for citation analysis and knowledge graph construction.',
      accessType: 'unlocked',
      pdfUrl: 'https://example.com/paper4.pdf',
      doi: '10.18653/v1/2024.emnlp-main.123',
      citations: 18,
      summary: 'Revolutionary graph neural network architecture for academic paper analysis with novel relationship modeling.',
      justification: 'Open access conference paper providing innovative graph-based approach to academic text analysis.'
    },
    {
      id: '5',
      title: 'Automated Citation Analysis and Recommendation Systems',
      authors: ['Grace Kim', 'Henry Park'],
      journal: 'ACM Transactions on Information Systems',
      year: 2023,
      abstract: 'We develop an automated system for analyzing citation patterns and recommending relevant papers, using machine learning algorithms and network analysis techniques.',
      accessType: 'preprint',
      preprintUrl: 'https://arxiv.org/abs/2023.67890',
      doi: '10.1145/1234567.1234568',
      citations: 41,
      summary: 'An intelligent citation recommendation system with 88% accuracy in relevant paper suggestions.',
      justification: 'Preprint offers early access to citation analysis methodology, useful for understanding recommendation systems.'
    }
  ];

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPapers(mockPapers);
      setLoading(false);
    }, 1500);
  };

  const handlePaperSelect = (paperId) => {
    setSelectedPapers(prev => {
      if (prev.includes(paperId)) {
        return prev.filter(id => id !== paperId);
      } else {
        return [...prev, paperId];
      }
    });
  };

  const handleSynthesis = () => {
    if (selectedPapers.length > 0) {
      // Navigate to synthesis page with selected papers
      console.log('Synthesizing papers:', selectedPapers);
    }
  };

  useEffect(() => {
    // Auto-search on component mount with a default query
    handleSearch('machine learning research papers');
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search Header */}
      <div className="card mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for research papers, authors, or topics..."
                className="input-field pl-10"
              />
            </div>
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="btn-primary px-8 py-3 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search Stats */}
        {papers.length > 0 && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Found {papers.length} papers</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Unlock className="h-4 w-4 text-green-600 mr-1" />
                {papers.filter(p => p.accessType === 'unlocked').length} Unlocked
              </span>
              <span className="flex items-center">
                <FileText className="h-4 w-4 text-yellow-600 mr-1" />
                {papers.filter(p => p.accessType === 'preprint').length} Preprints
              </span>
              <span className="flex items-center">
                <Lock className="h-4 w-4 text-red-600 mr-1" />
                {papers.filter(p => p.accessType === 'locked').length} Locked
              </span>
            </div>
          </div>
        )}

        {/* Research Project Workflow */}
        {papers.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Research Project Workflow</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span>Select 5 papers across all access tiers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span>Use AI analysis for 2 papers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span>Generate citations and reports</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-80">
          <SearchFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Papers List */}
        <div className="flex-1">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : papers.length > 0 ? (
            <div className="space-y-4">
              {papers.map((paper) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isSelected={selectedPapers.includes(paper.id)}
                  onSelect={() => handlePaperSelect(paper.id)}
                />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No papers found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Papers Actions */}
      {selectedPapers.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {selectedPapers.length} paper{selectedPapers.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={handleSynthesis}
              className="btn-primary text-sm px-4 py-2"
            >
              Synthesize Papers
            </button>
            <button
              onClick={() => setSelectedPapers([])}
              className="btn-secondary text-sm px-4 py-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
