import React, { useState } from 'react';
import { Network, Scan } from 'lucide-react';

interface ScanResult {
  port: number;
  status: 'open' | 'closed' | 'filtered';
}

function App() {
  const [ipAddress, setIpAddress] = useState('');
  const [startPort, setStartPort] = useState('');
  const [endPort, setEndPort] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<ScanResult[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsScanning(true);
    setResults([]);

    try {
      const start = parseInt(startPort);
      const end = parseInt(endPort);
      
      // Simulate scanning multiple ports
      for (let port = start; port <= end; port++) {
        // Note: This is a mock implementation
        // In a real app, this would call your backend service
        await new Promise(resolve => setTimeout(resolve, 200));
        const mockResult: ScanResult = {
          port: port,
          status: Math.random() > 0.5 ? 'open' : 'closed'
        };
        setResults(prev => [...prev, mockResult]);
      }
    } catch (err) {
      setError('Failed to scan ports. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const isValidIp = (ip: string) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;
    const parts = ip.split('.');
    return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
  };

  const isValidPort = (port: string) => {
    const portNum = parseInt(port);
    return !isNaN(portNum) && portNum > 0 && portNum <= 65535;
  };

  const isValidRange = () => {
    if (!isValidPort(startPort) || !isValidPort(endPort)) return false;
    const start = parseInt(startPort);
    const end = parseInt(endPort);
    return start <= end && (end - start) <= 1000; // Limit range to 1000 ports
  };

  const isFormValid = isValidIp(ipAddress) && isValidRange();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="text-center mb-12 flex items-center justify-center gap-3">
        <Network className="w-10 h-10 text-purple-400" />
        <h1 className="text-4xl font-bold text-purple-400">Port Scanner</h1>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-6 border border-transparent hover:border-purple-400/50 hover:shadow-purple-500/50 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ip" className="block text-sm font-medium mb-2">
                IP Address
              </label>
              <input
                id="ip"
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.1"
                className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-4 focus:ring-purple-500 focus:outline-none hover:ring-2 hover:ring-purple-400 transition-all text-white placeholder-gray-400"
              />
              {ipAddress && !isValidIp(ipAddress) && (
                <p className="text-red-400 text-sm mt-1">Please enter a valid IP address</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startPort" className="block text-sm font-medium mb-2">
                  Start Port
                </label>
                <input
                  id="startPort"
                  type="number"
                  value={startPort}
                  onChange={(e) => setStartPort(e.target.value)}
                  placeholder="80"
                  className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-4 focus:ring-purple-500 focus:outline-none hover:ring-2 hover:ring-purple-400 transition-all text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label htmlFor="endPort" className="block text-sm font-medium mb-2">
                  End Port
                </label>
                <input
                  id="endPort"
                  type="number"
                  value={endPort}
                  onChange={(e) => setEndPort(e.target.value)}
                  placeholder="100"
                  className="w-full px-4 py-2 bg-gray-700 rounded-md focus:ring-4 focus:ring-purple-500 focus:outline-none hover:ring-2 hover:ring-purple-400 transition-all text-white placeholder-gray-400"
                />
              </div>
            </div>

            {(startPort || endPort) && !isValidRange() && (
              <p className="text-red-400 text-sm">
                Please enter valid ports (1-65535). Maximum range is 1000 ports.
              </p>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isScanning}
              className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md ${
                isFormValid && !isScanning
                  ? 'bg-purple-500 hover:bg-purple-600 hover:ring-2 hover:ring-purple-400'
                  : 'bg-gray-600 cursor-not-allowed'
              } transition-all`}
            >
              <Scan className="w-5 h-5" />
              {isScanning ? 'Scanning...' : 'Scan Ports'}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-transparent hover:border-purple-400/50 text-red-400 p-4 rounded-md mb-6 hover:shadow-purple-500/50 transition-all duration-300">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-transparent hover:border-purple-400/50 hover:shadow-purple-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Scan Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-md border border-transparent hover:border-purple-400 transition-all duration-300 ${
                    result.status === 'open' ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}
                >
                  <span>Port {result.port}</span>
                  <span
                    className={`px-2 py-1 rounded-md text-sm ${
                      result.status === 'open'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {result.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;