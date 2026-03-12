import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Settings2, X } from 'lucide-react';
import PocketBase from 'pocketbase';

export function SteeringOverlay() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = searchParams.get('modal') === 'steering';

  const openModal = () => {
    setSearchParams(params => {
      params.set('modal', 'steering');
      return params;
    });
  };

  const closeModal = () => {
    setSearchParams(params => {
      params.delete('modal');
      return params;
    });
    setInputValue('');
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const pbUrl = window.location.protocol + "//" + window.location.hostname + ":8090";
      const pb = new PocketBase(pbUrl);
      
      let currentStateData: Record<string, unknown> = {};
      try {
          const record = await pb.collection('conductor_state').getOne('singleton123456');
          currentStateData = record.state_data || {};
      } catch (err: unknown) {
          if ((err as {status?: number}).status !== 404) {
              throw err;
          }
      }
      
      const currentPendingSteer = currentStateData.pending_steer || [];
      
      const updatedStateData = {
        ...currentStateData,
        pending_steer: [...currentPendingSteer, inputValue.trim()]
      };

      try {
          await pb.collection('conductor_state').update('singleton123456', {
            state_data: updatedStateData
          });
      } catch (err: unknown) {
          if ((err as {status?: number}).status === 404) {
              await pb.collection('conductor_state').create({
                  id: 'singleton123456',
                  state_data: updatedStateData
              });
          } else {
              throw err;
          }
      }

      closeModal();
    } catch (error) {
      console.error('Failed to submit steering directive:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-14 right-8 z-50 flex items-center gap-2 bg-electric-blue text-obsidian px-4 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] transition-all group"
      >
        <Settings2 size={18} className="group-hover:rotate-180 transition-transform duration-500" />
        Steer
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-obsidian/80 backdrop-blur-sm" id="steering-overlay">
          <div className="absolute inset-0 cursor-default" onClick={closeModal}></div>
          <div className="relative w-full max-w-lg bg-[#161b22] border border-border-muted shadow-2xl rounded-lg p-6 flex flex-col gap-4 mx-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-electric-blue shadow-[0_0_8px_#00F2FF]"></div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">Human-in-the-Loop Steering</h3>
              </div>
              <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="relative">
              <input
                autoFocus
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                className="w-full bg-[#0d1117] border border-border-muted rounded-lg py-3 px-4 text-sm font-mono text-electric-blue placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-electric-blue focus:border-electric-blue transition-all"
                placeholder="Awaiting architect directive..."
              />
            </div>
            
            <div className="flex justify-end items-center gap-4">
              <span className="text-[9px] font-mono text-slate-500 uppercase">Input stream active</span>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !inputValue.trim()}
                className="bg-electric-blue/10 hover:bg-electric-blue text-electric-blue hover:text-obsidian border border-electric-blue/30 text-[10px] font-bold px-5 py-2 rounded-lg uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Executing...' : 'Execute Directive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
