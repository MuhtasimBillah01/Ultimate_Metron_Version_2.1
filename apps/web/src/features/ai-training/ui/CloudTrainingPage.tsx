import React, { useState, useEffect, useRef } from 'react';
import { CloudLightning, Server, Database, Cpu, Brain, CheckCircle, Terminal, UploadCloud, FileUp, Download, FileJson, RefreshCw, FileText, BarChart3, FileSpreadsheet } from 'lucide-react';

const CloudTrainingPage: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState('Gemini 1.5 Pro');
  
  // Upload State
  const [datasetMode, setDatasetMode] = useState<'SYSTEM' | 'UPLOAD'>('SYSTEM');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setLogs(prev => [...prev, `> File loaded locally: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`]);
    }
  };

  const startTraining = () => {
    if (datasetMode === 'UPLOAD' && !uploadedFileName) {
      alert("Please upload a file first!");
      return;
    }

    setIsTraining(true);
    setTrainingComplete(false);
    setProgress(0);
    setLogs(prev => [
      ...prev, 
      '> Initializing Cloud Connection...', 
      datasetMode === 'UPLOAD' ? `> Preparing upload for ${uploadedFileName}...` : '> Selecting system datasets (BTC, ETH)...'
    ]);
  };

  const resetTraining = () => {
    setTrainingComplete(false);
    setProgress(0);
    setLogs([]);
    setUploadedFileName(null);
  };

  // Download Functions
  const downloadModel = () => {
    const modelData = {
      model: selectedModel,
      version: "2.4.0-beta",
      timestamp: new Date().toISOString(),
      hyperparameters: {
        learningRate: 0.001,
        batchSize: 64,
        epochs: 100,
        optimizer: "AdamW"
      },
      weights: "w_l1_0x442...992a", // Mock weight data
      metrics: {
        finalAccuracy: 0.984,
        finalLoss: 0.012
      },
      architecture: "Transformer-HFT-v4"
    };
    triggerDownload(`trained_model_${Date.now()}.json`, JSON.stringify(modelData, null, 2), 'application/json');
    addLog('> Downloaded: Model Weights (.json)');
  };

  const downloadLogs = () => {
    // Convert logs to a structured JSON format
    const logData = logs.map((log, index) => ({
      id: index,
      timestamp: new Date().toISOString(),
      level: log.includes('ERROR') ? 'ERROR' : 'INFO',
      message: log.replace('> ', '')
    }));
    triggerDownload(`training_logs_${Date.now()}.json`, JSON.stringify(logData, null, 2), 'application/json');
    addLog('> Downloaded: Execution Logs (.json)');
  };

  const downloadReport = () => {
    // Generate a detailed CSV report
    const headers = "Epoch,Training_Loss,Validation_Loss,Accuracy,Learning_Rate,Time_Sec\n";
    const rows = Array.from({length: 100}, (_, i) => {
      const epoch = i + 1;
      const loss = (0.5 * Math.exp(-0.05 * epoch)).toFixed(4);
      const valLoss = (0.55 * Math.exp(-0.04 * epoch)).toFixed(4);
      const acc = (0.6 + 0.35 * (1 - Math.exp(-0.05 * epoch))).toFixed(4);
      const lr = (0.001 * Math.exp(-0.01 * epoch)).toFixed(6);
      const time = (epoch * 0.5 + Math.random() * 0.1).toFixed(2);
      return `${epoch},${loss},${valLoss},${acc},${lr},${time}`;
    }).join("\n");
    
    triggerDownload(`performance_report_${Date.now()}.csv`, headers + rows, 'text/csv');
    addLog('> Downloaded: Performance Report (.csv)');
  };

  const triggerDownload = (filename: string, content: string, contentType: string) => {
    const dataStr = `data:${contentType};charset=utf-8,` + encodeURIComponent(content);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  useEffect(() => {
    if (isTraining && progress < 100) {
      const timer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          
          if (newProgress === 10) addLog(datasetMode === 'UPLOAD' ? '> Uploading custom dataset to secure bucket...' : '> Uploading 250MB Historical Data...');
          if (newProgress === 30) addLog(`> Handshake successful with ${selectedModel} API.`);
          if (newProgress === 45) addLog('> Offloading Tensor operations to remote TPU v5...');
          if (newProgress === 60) addLog('> Training Epoch 1/100 complete. Loss: 0.024');
          if (newProgress === 80) addLog('> Optimizing weights for HFT execution...');
          if (newProgress === 95) addLog('> Downloading trained model weights...');
          if (newProgress === 100) {
            addLog('> Training Complete. Artifacts ready for download.');
            setIsTraining(false);
            setTrainingComplete(true);
          }
          
          return newProgress;
        });
      }, 50); // Faster simulation
      return () => clearInterval(timer);
    }
  }, [isTraining, progress, selectedModel, datasetMode]);

  const addLog = (msg: string) => {
    setLogs(prev => {
        const newLogs = [...prev, msg];
        if (newLogs.length > 50) return newLogs.slice(newLogs.length - 50);
        return newLogs;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CloudLightning className="text-primary" /> Cloud AI Training Hub
          </h2>
          <p className="text-slate-400">Offload heavy model training to remote servers. Optimized for your hardware.</p>
        </div>
        <div className="px-3 py-1 bg-green-900/20 border border-green-500/30 rounded text-green-400 text-xs font-mono">
          Local CPU Load: Low (2%)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Configuration Panel */}
        <div className="bg-surface rounded-xl border border-slate-800 p-6 space-y-6">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Database size={18} className="text-blue-400" /> Training Configuration
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase font-bold">Select Cloud Provider</label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isTraining || trainingComplete}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-white focus:border-primary outline-none"
              >
                <option>Gemini 1.5 Pro (Google Cloud)</option>
                <option>DeepSeek V3 (Remote API)</option>
                <option>OpenAI GPT-4o (Fine-tuning)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase font-bold">Dataset Source</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button 
                    onClick={() => setDatasetMode('SYSTEM')}
                    disabled={isTraining || trainingComplete}
                    className={`p-2 rounded border text-sm transition-colors ${datasetMode === 'SYSTEM' ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                    System Data
                </button>
                <button 
                    onClick={() => setDatasetMode('UPLOAD')}
                    disabled={isTraining || trainingComplete}
                    className={`p-2 rounded border text-sm transition-colors ${datasetMode === 'UPLOAD' ? 'bg-primary/20 border-primary text-primary' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                >
                    Upload File
                </button>
              </div>

              {datasetMode === 'UPLOAD' && (
                  <div 
                    onClick={() => !isTraining && !trainingComplete && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        uploadedFileName ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
                    }`}
                  >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".json,.csv,.txt"
                        onChange={handleFileChange}
                      />
                      {uploadedFileName ? (
                          <>
                            <FileJson className="text-green-400 mb-2" size={24} />
                            <span className="text-xs text-green-400 font-bold break-all text-center">{uploadedFileName}</span>
                            <span className="text-[10px] text-green-500/70">Click to change</span>
                          </>
                      ) : (
                          <>
                            <FileUp className="text-slate-500 mb-2" size={24} />
                            <span className="text-xs text-slate-400">Click to upload .csv / .json</span>
                          </>
                      )}
                  </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase font-bold">Optimization Goal</label>
              <select disabled={isTraining || trainingComplete} className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-sm text-white outline-none">
                <option>Maximize Sharpe Ratio</option>
                <option>Minimize Drawdown</option>
                <option>Maximize Raw Profit</option>
              </select>
            </div>

            {!trainingComplete ? (
                <button 
                  onClick={startTraining}
                  disabled={isTraining}
                  className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                    isTraining 
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  }`}
                >
                  {isTraining ? (
                    <>
                      <UploadCloud size={18} className="animate-bounce" /> Sending Data...
                    </>
                  ) : (
                    <>
                      <Brain size={18} /> Start Cloud Training
                    </>
                  )}
                </button>
            ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400 mb-1 font-bold text-sm">
                            <CheckCircle size={16} /> Training Successful
                        </div>
                        <p className="text-[11px] text-slate-400">Model v2.4b optimized and ready for deployment.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-slate-400 uppercase font-bold">Download Artifacts</label>
                        
                        <button 
                          onClick={downloadModel}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 py-3 rounded-lg text-sm font-medium flex items-center justify-between px-4 border border-slate-700 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-500/20 rounded text-blue-400">
                              <FileJson size={16} />
                            </div>
                            <div className="flex flex-col items-start">
                              <span>Model Weights</span>
                              <span className="text-[10px] text-slate-500">JSON Format</span>
                            </div>
                          </div>
                          <Download size={16} className="text-slate-500 group-hover:text-white" />
                        </button>

                        <button 
                          onClick={downloadLogs}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 py-3 rounded-lg text-sm font-medium flex items-center justify-between px-4 border border-slate-700 transition-all group"
                        >
                           <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-slate-700/50 rounded text-slate-400">
                              <FileText size={16} />
                            </div>
                            <div className="flex flex-col items-start">
                              <span>Execution Logs</span>
                              <span className="text-[10px] text-slate-500">JSON Format</span>
                            </div>
                          </div>
                          <Download size={16} className="text-slate-500 group-hover:text-white" />
                        </button>
                        
                        <button 
                          onClick={downloadReport}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 py-3 rounded-lg text-sm font-medium flex items-center justify-between px-4 border border-slate-700 transition-all group"
                        >
                           <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-green-500/20 rounded text-green-400">
                              <FileSpreadsheet size={16} />
                            </div>
                            <div className="flex flex-col items-start">
                              <span>Performance Report</span>
                              <span className="text-[10px] text-slate-500">CSV Spreadsheet</span>
                            </div>
                          </div>
                          <Download size={16} className="text-slate-500 group-hover:text-white" />
                        </button>
                    </div>

                    <button 
                      onClick={resetTraining}
                      className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/20"
                    >
                      <RefreshCw size={18} /> Start New Session
                    </button>
                </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-3 bg-amber-900/10 border border-amber-900/30 rounded-lg">
              <Cpu size={24} className="text-amber-500 shrink-0" />
              <div className="text-xs text-amber-200">
                <strong>Hardware Saver Mode:</strong> Training runs on external APIs. Your PC won't lag.
              </div>
            </div>
          </div>
        </div>

        {/* Status & Terminal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Resource Visualizer */}
          <div className="bg-surface rounded-xl border border-slate-800 p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Server size={18} className="text-purple-400" /> Resource Allocation
            </h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center space-y-2">
                <div className="text-slate-400 text-xs uppercase font-bold">Local PC (Yours)</div>
                <div className="relative w-24 h-24 mx-auto rounded-full border-4 border-slate-700 flex items-center justify-center">
                  <div className="text-xl font-bold text-slate-300">2%</div>
                  <Cpu className="absolute -bottom-2 bg-surface px-1 text-slate-500" size={20} />
                </div>
                <div className="text-xs text-green-400">Status: Idle</div>
              </div>

              <div className="text-center space-y-2">
                <div className="text-slate-400 text-xs uppercase font-bold">Cloud GPU Cluster</div>
                <div className={`relative w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center transition-all ${isTraining ? 'border-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-slate-700'}`}>
                   <div className={`text-xl font-bold ${isTraining ? 'text-white' : 'text-slate-500'}`}>
                     {isTraining ? '98%' : '0%'}
                   </div>
                   <CloudLightning className={`absolute -bottom-2 bg-surface px-1 ${isTraining ? 'text-primary' : 'text-slate-500'}`} size={20} />
                </div>
                <div className={`text-xs ${isTraining ? 'text-primary animate-pulse' : 'text-slate-500'}`}>
                  Status: {isTraining ? 'Heavy Load' : 'Waiting'}
                </div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-[300px] font-mono text-sm relative overflow-hidden">
             <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2">
               <Terminal size={14} className="text-slate-400" />
               <span className="text-xs text-slate-400 uppercase">Remote Execution Log</span>
               {trainingComplete && <span className="ml-auto text-xs text-green-400 flex items-center gap-1"><CheckCircle size={12}/> Complete</span>}
             </div>
             
             <div className="flex-1 p-4 overflow-y-auto space-y-1 custom-scrollbar">
                {logs.length === 0 && <span className="text-slate-600">Ready to initiate connection...</span>}
                {logs.map((log, idx) => (
                  <div key={idx} className="text-slate-300 animate-in fade-in slide-in-from-left-2 duration-300 break-words">
                    {log}
                  </div>
                ))}
                {isTraining && (
                   <div className="text-primary animate-pulse">_</div>
                )}
             </div>

             {/* Progress Bar Overlay */}
             {isTraining && (
               <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
                 <div 
                   className="h-full bg-primary transition-all duration-300 ease-out"
                   style={{ width: `${progress}%` }}
                 ></div>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CloudTrainingPage;
