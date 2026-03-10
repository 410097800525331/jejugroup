/* ========== AI Chatbot Module (Integrated - Backend Proxy) ========== */

class HotelChatbot {
    constructor() {
        // API Key managed by backend
        this.messages = [];
        this.isOpen = false;
        this.isLoading = false;
        this.conversationHistory = [];
        
        // Initialize Language
        this.language = localStorage.getItem('jeju_fab_lang') || 'ko';
        
        this.init();
    }

    init() {
        this.updateSystemPrompt(this.language);
        this.createChatbotUI();
        this.attachEventListeners();
        this.addWelcomeMessage();
    }

    updateSystemPrompt(lang) {
        this.language = lang;
        if (lang === 'en') {
            this.systemPrompt = `You are the JEJU STAY reservation AI assistant, affiliated with Jeju Air.

[Benefits & Important Info]
1. Additional 7% discount on worldwide hotels when verified as a Jeju Air passenger.
2. Hotel payments available using Jeju Air Refresh Points.
3. Special rates for long-term stays (14+ nights).
4. All prices can be provided in KRW and USD.

[Role]
- Maintain a friendly and professional tone.
- Guide on hotel reservations, locations, room types, and amenities.
- Keep answers concise (3-4 sentences).
- Recommend contacting the Front Desk (1599-1500) for uncertain info.

[Hotel Info]
- Name: JEJU STAY (Global Hotel Booking Platform)
- Feature: Lowest price reservations for over 2 million hotels/resorts/pensions worldwide.`;
        } else {
            this.systemPrompt = `당신은 제주항공(Jeju Air)과 연계된 JEJU STAY 예약 상담 AI입니다.

[상담 혜택 및 중요 정보]
1. 제주항공 탑승객 인증 시 전 세계 호텔 7% 추가 할인 혜택이 있습니다.
2. 제주항공 리프레시 포인트(Refresh Point)로 호텔 결제가 가능합니다.
3. 14박 이상 장기 투숙(한 달 살기 등) 시 전용 특별 요금이 적용됩니다.
4. 모든 가격 정보는 KRW(원화) 및 USD(달러)로 안내 가능합니다.

[역할]
- 친절하고 전문적인 톤앤매너 유지.
- 답변은 3~4문장 내외로 간결하게.
- 확실하지 않은 정보는 프론트 데스크(1599-1500) 문의 권장.

[호텔 정보]
- 명칭: JEJU STAY (글로벌 호텔 예약 플랫폼)
- 특징: 전 세계 200만 개 호텔/리조트/펜션 최저가 예약.`;
        }
    }

    createChatbotUI() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'chatbot-toggle-btn hidden'; // Default hidden
        toggleBtn.innerHTML = '<i data-lucide="message-circle"></i>';
        toggleBtn.setAttribute('aria-label', this.language === 'en' ? 'Open Chatbot' : '챗봇 열기');
        document.body.appendChild(toggleBtn);

        const container = document.createElement('div');
        container.className = 'chatbot-container';
        container.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-header-title">
                   ${this.language === 'en' ? 'AI Assistant' : 'AI 상담사'}
                </div>
                <button class="chatbot-close-btn" aria-label="${this.language === 'en' ? 'Close' : '닫기'}">
                    <i data-lucide="x" style="width:20px; height:20px;"></i>
                </button>
            </div>
            <div class="chatbot-messages" id="chatbotMessages"></div>
            <div class="chatbot-input-area">
                <div class="chatbot-input-wrapper">
                    <input 
                        type="text" 
                        class="chatbot-input" 
                        id="chatbotInput" 
                        placeholder="${this.language === 'en' ? 'How can I help you?' : '문의하실 내용을 입력해주세요...'}"
                        autocomplete="off"
                    />
                </div>
                <button class="chatbot-send-btn" id="chatbotSendBtn" aria-label="${this.language === 'en' ? 'Send' : '전송'}">
                    <i data-lucide="send" style="width:20px; height:20px;"></i>
                </button>
            </div>
        `;
        document.body.appendChild(container);

        this.toggleBtn = toggleBtn;
        this.container = container;
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSendBtn');
        this.closeBtn = container.querySelector('.chatbot-close-btn');

        if (window.lucide) lucide.createIcons();
    }

    attachEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggleChatbot());
        this.closeBtn.addEventListener('click', () => this.closeChatbot());
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChatbot();
            }
        });

        // Language Change Listener
        document.addEventListener('fabLanguageChanged', (e) => {
            this.updateLanguage(e.detail);
        });
    }

    updateLanguage(lang) {
        this.updateSystemPrompt(lang);
        
        // Update UI Text
        const titleEl = this.container.querySelector('.chatbot-header-title');
        const inputEl = this.input;
        
        if (lang === 'en') {
            titleEl.textContent = 'AI Assistant';
            inputEl.placeholder = 'How can I help you?';
            this.toggleBtn.setAttribute('aria-label', 'Open Chatbot');
        } else {
            titleEl.textContent = 'AI 상담사';
            inputEl.placeholder = '문의하실 내용을 입력해주세요...';
            this.toggleBtn.setAttribute('aria-label', '챗봇 열기');
        }

        // Reset Chat Logic
        this.messages = [];
        this.conversationHistory = [];
        this.messagesContainer.innerHTML = ''; // Clear UI
        
        // Add System Notification
        const notification = {
            type: 'bot',
            content: lang === 'en' ? 'Language changed. Chat history has been reset.' : '언어가 변경되어 대화 내용이 초기화되었습니다.',
            timestamp: new Date()
        };
        this.messages.push(notification);
        this.renderMessage(notification, 'system');

        // New Welcome Message
        this.addWelcomeMessage();
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        this.isOpen = true;
        this.container.classList.add('active');
        this.toggleBtn.classList.add('hidden');
        this.input.focus();
        this.scrollToBottom();
    }

    closeChatbot() {
        this.isOpen = false;
        this.container.classList.remove('active');
        if (!document.getElementById('fabSystem')) {
            this.toggleBtn.classList.remove('hidden');
        }
    }

    addWelcomeMessage() {
        const welcomeContent = this.language === 'en' 
            ? 'Hello! 👋 I am your Jeju Stay AI Assistant. I can help with reservations, 7% discounts, and more.' 
            : '안녕하세요! 👋 제주그룹 회원님을 위한 특별한 혜택 상담을 도와드릴까요? (7% 할인, 포인트 결제 등)';

        const welcomeMsg = {
            type: 'bot',
            content: welcomeContent,
            timestamp: new Date()
        };
        this.messages.push(welcomeMsg);
        this.renderMessage(welcomeMsg, 'welcome');
    }

    async sendMessage() {
        const content = this.input.value.trim();
        if (!content) return;

        this.input.disabled = true;
        this.sendBtn.disabled = true;
        this.isLoading = true;

        const userMsg = {
            type: 'user',
            content: content,
            timestamp: new Date()
        };
        this.messages.push(userMsg);
        this.renderMessage(userMsg);

        this.input.value = '';
        this.showTypingIndicator();

        try {
            const response = await this.getAIResponse(content);
            this.removeTypingIndicator();

            const botMsg = {
                type: 'bot',
                content: response,
                timestamp: new Date()
            };
            this.messages.push(botMsg);
            this.renderMessage(botMsg);

        } catch (error) {
            console.error('Chatbot error:', error);
            this.removeTypingIndicator();

            const errorText = error.message;
            const errorMsg = {
                type: 'bot',
                content: `죄송합니다. 서버 에러가 발생했습니다. (${errorText}) - 네트워트 탭이나 넷리파이 로그를 확인해줘.`,
                timestamp: new Date()
            };
            this.messages.push(errorMsg);
            this.renderMessage(errorMsg, 'error');
        } finally {
            this.input.disabled = false;
            this.sendBtn.disabled = false;
            this.isLoading = false;
            this.input.focus();
        }
    }

    async getAIResponse(userMessage) {
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });
        
        try {
            // RayPersona: Secure Call to AlwaysData Backend
            const response = await fetch('https://jejugroup.alwaysdata.net/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: this.systemPrompt },
                        ...this.conversationHistory
                    ]
                })
            });

            if (!response.ok) throw new Error(`Server Error: ${response.status}`);

            const data = await response.json();
            
            // Validate OpenAI format response
            if (!data.choices?.[0]?.message?.content) throw new Error('Invalid API response from Backend');

            const aiResponse = data.choices[0].message.content;

            this.conversationHistory.push({ role: 'assistant', content: aiResponse });
            
            // Limit history to prevent token limit issues
            if (this.conversationHistory.length > 10) {
                this.conversationHistory = this.conversationHistory.slice(-10);
            }

            return aiResponse;

        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }

    renderMessage(message, className = '') {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.type} ${className}`;

        const bubbleEl = document.createElement('div');
        bubbleEl.className = 'message-bubble';
        bubbleEl.innerHTML = message.content.replace(/\n/g, '<br>');

        messageEl.appendChild(bubbleEl);

        const timeEl = document.createElement('div');
        timeEl.className = 'message-time';
        timeEl.textContent = this.formatTime(message.timestamp);
        messageEl.appendChild(timeEl);

        this.messagesContainer.appendChild(messageEl);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typingEl = document.createElement('div');
        typingEl.className = 'message bot';
        typingEl.id = 'typingIndicator';
        typingEl.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.messagesContainer.appendChild(typingEl);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingEl = document.getElementById('typingIndicator');
        if (typingEl) typingEl.remove();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 50);
    }

    formatTime(date) {
        return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // No API Key needed on frontend
    window.hotelChatbot = new HotelChatbot();
});