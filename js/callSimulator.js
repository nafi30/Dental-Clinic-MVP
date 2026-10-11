/**
 * callSimulator.js - Centerpiece Live Voice AI Simulation Engine
 * Synthesizes ring/chime sounds via Web Audio API and runs the real-time cascade.
 */

export class CallSimulator {
  constructor() {
    this.audioCtx = null;
    this.isCallActive = false;
    this.dialogueStep = 0;
    this.simulationTimer = null;
    this.audioOscillators = [];
  }

  initAudio() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    } catch (e) {
      console.warn("Web Audio API not supported or blocked", e);
    }
  }

  // Realistic telephone ring cadence (US standard: 440Hz + 480Hz)
  playRingTone() {
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.frequency.value = 440;
      osc2.frequency.value = 480;

      gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime + 1.2);
      gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 1.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start();
      osc2.start();

      osc1.stop(this.audioCtx.currentTime + 1.4);
      osc2.stop(this.audioCtx.currentTime + 1.4);
    } catch (e) {
      console.warn("Ring sound error", e);
    }
  }

  // Pleasant connection chime
  playConnectChime() {
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.25); // A5

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.65);
    } catch (e) {
      console.warn("Chime error", e);
    }
  }

  // Success confirmation bell
  playSuccessChime() {
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = this.audioCtx.currentTime + index * 0.08;
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.45);
      });
    } catch (e) {
      console.warn("Success sound error", e);
    }
  }

  /**
   * Launch the interactive simulation modal
   */
  startSimulation() {
    this.initAudio();
    this.playRingTone();

    const ringInterval = setInterval(() => {
      if (!this.isCallActive) {
        this.playRingTone();
      } else {
        clearInterval(ringInterval);
      }
    }, 2800);

    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'call-simulation-modal';

    modal.innerHTML = `
      <div class="modal-dialog modal-lg call-sim-card" style="border-radius: var(--radius-xl); overflow: hidden;">
        <!-- Top Call Bar -->
        <div class="call-sim-header">
          <div class="call-status-badge" id="sim-status-badge">
            <span class="ai-pulse-dot" style="margin-left:0; margin-right:4px;"></span>
            <span id="sim-status-text">Incoming After-Hours Call</span>
          </div>
          <div class="call-timer" id="sim-call-timer">00:00</div>
          <button class="modal-close-btn" id="btn-close-sim" style="color: #94A3B8;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Caller Identity Hero -->
        <div class="call-caller-hero">
          <div class="caller-avatar ringing" id="sim-caller-avatar">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <h3 class="caller-name">Marcus Sterling</h3>
          <div class="caller-meta">
            <span>+1 (512) 555-3928</span>
            <span>·</span>
            <span style="color: var(--crimson-400); font-weight: 700;">After-Hours Emergency (8:48 PM)</span>
          </div>

          <!-- Answer Button (Pre-Call) -->
          <div id="sim-answer-controls" style="margin-top: 20px;">
            <button class="btn btn-simulate-call" id="btn-accept-call" style="padding: 12px 28px; font-size: 14px; background: #059669; border-color: #10B981;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Let AI Answer Call Now (2 Rings)
            </button>
          </div>

          <!-- Audio Waveform (Visible when call is active) -->
          <div class="waveform-container" id="sim-waveform" style="display: none;">
            ${Array.from({length: 28}).map(() => `<div class="wave-bar"></div>`).join('')}
          </div>
        </div>

        <!-- Live Conversation Transcript Stream -->
        <div class="sim-transcript-box" id="sim-transcript" style="display: none;"></div>

        <!-- Real-Time Reactive Cascade Panel -->
        <div class="cascade-status-panel" id="sim-cascade-panel" style="display: none;">
          <div class="cascade-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Live Automated Practice Sync
          </div>
          <div class="cascade-steps">
            <div class="cascade-step-card" id="step-triage">
              <span class="step-label">1. Clinical Triage</span>
              <span class="step-val" id="val-triage">Listening...</span>
            </div>
            <div class="cascade-step-card" id="step-calendar">
              <span class="step-label">2. Calendar Booking</span>
              <span class="step-val" id="val-calendar">Checking slots...</span>
            </div>
            <div class="cascade-step-card" id="step-crm">
              <span class="step-label">3. CRM & Revenue</span>
              <span class="step-val" id="val-crm">Pending...</span>
            </div>
          </div>
        </div>

        <!-- Final Action Bar (Appears on completion) -->
        <div class="modal-footer" id="sim-complete-actions" style="display: none; background: rgba(0,0,0,0.3); border-color: rgba(255,255,255,0.08); justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px; color: #34D399; font-weight: 700; font-size: 13px;">
            <span>🎉 Call Recovered & Appointment Secured! (+$380 Pipeline)</span>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm" id="btn-goto-calendar" style="background: rgba(255,255,255,0.1); color:#FFF; border-color:rgba(255,255,255,0.2);">
              View in Calendar →
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-goto-patients" style="background: rgba(255,255,255,0.1); color:#FFF; border-color:rgba(255,255,255,0.2);">
              View Patient in CRM →
            </button>
            <button class="btn btn-primary btn-sm" id="btn-done-sim">
              Done
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close button
    const closeModal = () => {
      clearInterval(ringInterval);
      clearInterval(this.simulationTimer);
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 250);
    };

    modal.querySelector('#btn-close-sim').addEventListener('click', closeModal);

    // Accept call handler
    modal.querySelector('#btn-accept-call').addEventListener('click', () => {
      clearInterval(ringInterval);
      this.runCallDialogue(modal);
    });

    // Auto-answer after 3.5 seconds if user just watches
    const autoAnswerTimeout = setTimeout(() => {
      if (!this.isCallActive && document.getElementById('call-simulation-modal')) {
        clearInterval(ringInterval);
        this.runCallDialogue(modal);
      }
    }, 3500);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        clearTimeout(autoAnswerTimeout);
        closeModal();
      }
    });
  }

  runCallDialogue(modal) {
    this.isCallActive = true;
    this.playConnectChime();

    const avatar = modal.querySelector('#sim-caller-avatar');
    avatar.classList.remove('ringing');

    modal.querySelector('#sim-status-text').textContent = 'AI Voice Receptionist Connected';
    modal.querySelector('#sim-status-badge').style.background = 'rgba(13, 148, 136, 0.2)';
    modal.querySelector('#sim-status-badge').style.color = '#2DD4BF';
    modal.querySelector('#sim-status-badge').style.borderColor = 'rgba(45, 212, 191, 0.4)';

    modal.querySelector('#sim-answer-controls').style.display = 'none';
    const waveform = modal.querySelector('#sim-waveform');
    waveform.style.display = 'flex';
    waveform.classList.add('waveform-active');

    const transcriptBox = modal.querySelector('#sim-transcript');
    transcriptBox.style.display = 'flex';

    const cascadePanel = modal.querySelector('#sim-cascade-panel');
    cascadePanel.style.display = 'flex';

    // Start timer
    let seconds = 0;
    const timerEl = modal.querySelector('#sim-call-timer');
    this.simulationTimer = setInterval(() => {
      seconds++;
      const m = String(Math.floor(seconds / 60)).padStart(2, '0');
      const s = String(seconds % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
    }, 1000);

    const dialogueScript = [
      {
        speaker: 'AI',
        text: "Thank you for calling Beacon Peak Dental Group after hours. I'm Aesora, the clinic's digital coordinator. How can I assist you tonight?",
        action: () => {
          modal.querySelector('#val-triage').textContent = 'Triaging chief complaint...';
        }
      },
      {
        speaker: 'Caller',
        text: "Hi! I fractured a back tooth while eating dinner about twenty minutes ago. It's sharp, hurting badly, and I can't sleep like this. Can I see a dentist first thing tomorrow?",
        action: () => {
          modal.querySelector('#step-triage').classList.add('active');
          modal.querySelector('#val-triage').textContent = '✓ Emergency Broken Molar (Priority)';
          modal.querySelector('#val-calendar').textContent = 'Checking Dr. Vance Chair 1...';
        }
      },
      {
        speaker: 'AI',
        text: "I'm so sorry you're in pain, Marcus! We treat broken teeth with high priority. Dr. Alexander Vance has an emergency operatory slot open tomorrow at 9:30 AM in Chair 1. Would that work for you?",
        action: () => {
          modal.querySelector('#step-calendar').classList.add('active');
          modal.querySelector('#val-calendar').textContent = 'Reserved: Tomorrow 9:30 AM (Chair 1)';
        }
      },
      {
        speaker: 'Caller',
        text: "Yes! 9:30 AM is perfect. Thank you so much.",
        action: () => {
          modal.querySelector('#step-crm').classList.add('active');
          modal.querySelector('#val-crm').textContent = '✓ Added to CRM & SMS dispatched';
        }
      },
      {
        speaker: 'AI',
        text: "You are locked in for 9:30 AM tomorrow with Dr. Vance. I've automatically reserved Chair 1 and sent an SMS with clinic directions and temporary pain tips to this number. We'll take care of you in the morning!",
        action: () => {
          // Finalize call
          waveform.classList.remove('waveform-active');
          this.playSuccessChime();

          // Execute cascade in Store
          const result = window.appStore.executeAiBookingCascade({
            patientName: "Marcus Sterling",
            phone: "+1 (512) 555-3928",
            reason: "Emergency Broken Molar with Acute Pain",
            dentistName: "Dr. Alexander Vance",
            dentistId: "d-1",
            date: "2026-10-13",
            time: "9:30 AM",
            operatory: "Chair 1 (Operatory A)",
            estimatedValue: 380
          });

          // Show complete action bar
          modal.querySelector('#sim-complete-actions').style.display = 'flex';

          // Toast notification
          window.showToast("🎉 AI Recovered Call: Marcus Sterling booked for tomorrow at 9:30 AM (+$380 revenue saved)", "recovered");

          // Buttons
          modal.querySelector('#btn-goto-calendar').addEventListener('click', () => {
            clearInterval(this.simulationTimer);
            modal.remove();
            window.navigateTo('calendar');
          });

          modal.querySelector('#btn-goto-patients').addEventListener('click', () => {
            clearInterval(this.simulationTimer);
            modal.remove();
            window.navigateTo('patients');
            setTimeout(() => {
              window.openPatientDrawer(result.patient.id);
            }, 200);
          });

          modal.querySelector('#btn-done-sim').addEventListener('click', () => {
            clearInterval(this.simulationTimer);
            modal.remove();
            window.rerenderCurrentView();
          });
        }
      }
    ];

    let currentStep = 0;
    const playNextLine = () => {
      if (currentStep >= dialogueScript.length) return;

      const item = dialogueScript[currentStep];
      const bubble = document.createElement('div');
      bubble.className = `sim-message ${item.speaker === 'AI' ? 'ai' : 'caller'}`;
      bubble.innerHTML = `
        <div class="message-sender">${item.speaker === 'AI' ? 'Aesora Voice AI' : 'Marcus Sterling'}</div>
        <div class="message-bubble">${item.text}</div>
      `;
      transcriptBox.appendChild(bubble);
      transcriptBox.scrollTop = transcriptBox.scrollHeight;

      if (item.action) item.action();

      currentStep++;
      if (currentStep < dialogueScript.length) {
        // Delay between lines: 2.2s for human, 1.8s for AI
        const delay = item.speaker === 'Caller' ? 2200 : 2600;
        setTimeout(playNextLine, delay);
      }
    };

    // Begin speaking
    setTimeout(playNextLine, 600);
  }
}

// Global simulator singleton
window.callSimulator = new CallSimulator();
window.triggerCallSimulation = () => {
  window.callSimulator.startSimulation();
};
