// Wallet Service Client
class WalletService {
    constructor() {
        this.userId = null;
        this.token = null;
        this.balance = 1000; // Default/fallback
    }
    
    // Initialize with user credentials (from parent website)
    init(userId, token) {
        this.userId = userId;
        this.token = token;
        return this.fetchBalance();
    }
    
    // Fetch balance from API
    async fetchBalance() {
        if (!this.userId || !this.token) {
            console.warn('Wallet: No user credentials');
            return this.balance;
        }
        
        try {
            const response = await fetch(`/api/wallet/balance`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.balance = data.balance || 1000;
                return this.balance;
            } else {
                console.error('Wallet: Failed to fetch balance');
                return this.balance;
            }
        } catch (error) {
            console.error('Wallet: Network error', error);
            return this.balance;
        }
    }
    
    // Update balance after game
    async updateBalance(amount, type) {
        if (!this.userId || !this.token) {
            console.warn('Wallet: No user credentials for update');
            this.balance += amount;
            return this.balance;
        }
        
        try {
            const response = await fetch(`/api/wallet/update`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: this.userId,
                    amount: amount,
                    type: type, // 'win' or 'loss'
                    game: 'noufi',
                    timestamp: Date.now()
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.balance = data.newBalance;
                return this.balance;
            } else {
                console.error('Wallet: Failed to update balance');
                this.balance += amount; // Fallback local update
                return this.balance;
            }
        } catch (error) {
            console.error('Wallet: Update network error', error);
            this.balance += amount; // Fallback
            return this.balance;
        }
    }
    
    getBalance() {
        return this.balance;
    }
}

// Initialize from URL parameters (passed from parent website)
function initWalletFromURL() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    const token = params.get('token');
    
    if (userId && token) {
        return walletService.init(userId, token);
    } else {
        console.warn('No wallet credentials in URL, using default balance');
        return Promise.resolve(1000);
    }
}

// Export
const walletService = new WalletService();
window.walletService = walletService;
