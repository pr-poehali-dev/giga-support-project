import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface User {
  email: string;
  username: string;
  isVerified: boolean;
  isAdmin: boolean;
  coins: number;
  level: number;
  xp: number;
  donations: number;
  gamesPlayed: number;
}

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [currentUser, setCurrentUser] = useState<User>({
    email: '',
    username: 'ProGamer',
    isVerified: false,
    isAdmin: false,
    coins: 1250,
    level: 12,
    xp: 65,
    donations: 24,
    gamesPlayed: 156
  });

  const [messages, setMessages] = useState([
    { id: 1, text: 'Привет! Я твой AI-ассистент 🤖', sender: 'ai', time: '14:20' },
    { id: 2, text: 'Как дела?', sender: 'user', time: '14:21' },
  ]);
  const [inputText, setInputText] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(0);
  const [messageBlocked, setMessageBlocked] = useState(false);

  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false);
  const [purchaseItem, setPurchaseItem] = useState<{name: string, price: number} | null>(null);

  const [lastDonationTime, setLastDonationTime] = useState(0);
  const [donationBlocked, setDonationBlocked] = useState(false);

  const [allUsers, setAllUsers] = useState<User[]>([
    { email: 'user1@test.com', username: '👑 ProGamer228', isVerified: true, isAdmin: false, coins: 15420, level: 25, xp: 80, donations: 45, gamesPlayed: 320 },
    { email: 'user2@test.com', username: '⭐ MegaPlayer', isVerified: true, isAdmin: false, coins: 12350, level: 22, xp: 55, donations: 38, gamesPlayed: 280 },
    { email: 'user3@test.com', username: '🔥 TopWinner', isVerified: false, isAdmin: false, coins: 9870, level: 18, xp: 40, donations: 25, gamesPlayed: 195 },
  ]);

  const handleAuth = () => {
    if (authMode === 'register') {
      if (!email || !username || !password) {
        toast.error('Заполните все поля');
        return;
      }
      
      const newUser: User = {
        email,
        username,
        isVerified: false,
        isAdmin: email === 'admin@giga.com',
        coins: 500,
        level: 1,
        xp: 0,
        donations: 0,
        gamesPlayed: 0
      };
      
      setCurrentUser(newUser);
      setAllUsers([...allUsers, newUser]);
      toast.success('Регистрация успешна! Проверьте email для верификации.');
      setIsLoggedIn(true);
      setShowAuthDialog(false);
    } else {
      if (!email || !password) {
        toast.error('Заполните все поля');
        return;
      }
      
      if (email === 'admin@giga.com') {
        setCurrentUser({...currentUser, email, isAdmin: true, isVerified: true});
      } else {
        setCurrentUser({...currentUser, email});
      }
      
      toast.success('Вход выполнен!');
      setIsLoggedIn(true);
      setShowAuthDialog(false);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const now = Date.now();
    if (now - lastMessageTime < 5000) {
      const remainingTime = Math.ceil((5000 - (now - lastMessageTime)) / 1000);
      toast.error(`⏳ Подождите ${remainingTime} сек. перед следующим сообщением`);
      setMessageBlocked(true);
      return;
    }
    
    const newMsg = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInputText('');
    setLastMessageTime(now);
    setMessageBlocked(false);
    
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: '🎮 Круто! Хочешь сыграть в мини-игру или проверить донаты?',
        sender: 'ai',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 800);
  };

  const triggerDonation = (amount: number, donorUsername: string) => {
    const now = Date.now();
    if (now - lastDonationTime < 5000) {
      const remainingTime = Math.ceil((5000 - (now - lastDonationTime)) / 1000);
      toast.error(`⏳ Подождите ${remainingTime} сек. перед следующим донатом`);
      return;
    }

    const donations = [
      { amount: 100, emoji: '💰', color: 'from-yellow-500 to-orange-500' },
      { amount: 500, emoji: '💎', color: 'from-purple-500 to-pink-500' },
      { amount: 1000, emoji: '👑', color: 'from-pink-500 to-red-500' },
    ];
    
    const donation = donations.find(d => d.amount === amount) || donations[0];
    
    toast.custom((t) => (
      <div className={`bg-gradient-to-r ${donation.color} p-6 rounded-xl text-white shadow-2xl animate-in slide-in-from-top-5 duration-700`}>
        <div className="flex items-center gap-4">
          <div className="text-5xl animate-pulse">{donation.emoji}</div>
          <div>
            <div className="font-bold text-2xl">ДОНАТ!</div>
            <div className="text-lg">{donorUsername} отправил {amount} руб.</div>
          </div>
        </div>
      </div>
    ));
    
    setCurrentUser({...currentUser, coins: currentUser.coins + amount, donations: currentUser.donations + 1});
    setLastDonationTime(now);
  };

  const spinRoulette = () => {
    const win = Math.floor(Math.random() * 500) + 50;
    setCurrentUser({
      ...currentUser, 
      coins: currentUser.coins + win,
      xp: Math.min(100, currentUser.xp + 5),
      gamesPlayed: currentUser.gamesPlayed + 1
    });
    toast.success(`🎰 Выиграл ${win} монет!`, {
      description: '+5 XP',
    });
  };

  const handlePurchase = (itemName: string, price: number) => {
    if (currentUser.coins < price) {
      toast.error(`❌ Недостаточно монет! Нужно ${price}, у вас ${currentUser.coins}`);
      return;
    }
    
    setPurchaseItem({name: itemName, price});
    setShowPurchaseConfirm(true);
  };

  const confirmPurchase = () => {
    if (!purchaseItem) return;
    
    setCurrentUser({...currentUser, coins: currentUser.coins - purchaseItem.price});
    toast.success(`Куплено: ${purchaseItem.name}! 🎉`);
    setShowPurchaseConfirm(false);
    setPurchaseItem(null);
  };

  const verifyUser = () => {
    setCurrentUser({...currentUser, isVerified: true});
    toast.success('✅ Аккаунт верифицирован!', {
      description: 'Теперь вам доступны все функции'
    });
  };

  const toggleUserVerification = (userEmail: string) => {
    setAllUsers(allUsers.map(u => 
      u.email === userEmail ? {...u, isVerified: !u.isVerified} : u
    ));
    toast.success('Статус верификации обновлен');
  };

  const updateUserData = (userEmail: string, field: keyof User, value: any) => {
    setAllUsers(allUsers.map(u => 
      u.email === userEmail ? {...u, [field]: value} : u
    ));
    toast.success('Данные пользователя обновлены');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (messageBlocked) {
      timer = setTimeout(() => setMessageBlocked(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [messageBlocked]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="bg-card border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {authMode === 'login' ? '🚀 Вход в GIGA BOT' : '✨ Регистрация'}
              </DialogTitle>
              <DialogDescription>
                {authMode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted/50 border-purple-500/30"
                />
              </div>
              
              {authMode === 'register' && (
                <div>
                  <Label htmlFor="username">Имя пользователя</Label>
                  <Input
                    id="username"
                    placeholder="ProGamer123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-muted/50 border-purple-500/30"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-muted/50 border-purple-500/30"
                />
              </div>
            </div>

            <DialogFooter className="flex-col gap-2">
              <Button 
                onClick={handleAuth}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="w-full"
              >
                {authMode === 'login' ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              GIGA BOT 🚀
            </h1>
            <p className="text-purple-300 text-sm mt-1">Игровой бот для @Giga_1bes</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 px-4 py-2">
              <div className="flex items-center gap-2">
                <Icon name="Coins" className="text-yellow-400" size={20} />
                <span className="font-bold text-xl text-yellow-400 coin-float">{currentUser.coins}</span>
              </div>
            </Card>
            
            <Card className="bg-card/50 border-purple-500/30 px-4 py-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500">
                  LVL {currentUser.level}
                </Badge>
                <div className="w-20">
                  <Progress value={currentUser.xp} className="h-2" />
                </div>
              </div>
            </Card>

            {currentUser.isVerified && (
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                <Icon name="BadgeCheck" size={14} className="mr-1" />
                Verified
              </Badge>
            )}

            {currentUser.isAdmin && (
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500">
                <Icon name="Shield" size={14} className="mr-1" />
                Admin
              </Badge>
            )}
          </div>
        </header>

        <Tabs defaultValue={currentUser.isAdmin ? "admin" : "chat"} className="space-y-4">
          <TabsList className={`grid w-full ${currentUser.isAdmin ? 'grid-cols-6' : 'grid-cols-5'} bg-card/50 p-1`}>
            <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              <Icon name="MessageSquare" size={18} className="mr-2" />
              AI-Чат
            </TabsTrigger>
            <TabsTrigger value="donate" className="data-[state=active]:bg-secondary data-[state=active]:text-white">
              <Icon name="Zap" size={18} className="mr-2" />
              Донаты
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-accent data-[state=active]:text-black">
              <Icon name="Gamepad2" size={18} className="mr-2" />
              Игры
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-purple-500">
              <Icon name="ShoppingBag" size={18} className="mr-2" />
              Магазин
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-pink-500">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
            {currentUser.isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-red-500">
                <Icon name="Shield" size={18} className="mr-2" />
                Админ
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card className="bg-card/50 border-purple-500/30 p-6 h-[600px] flex flex-col">
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 animate-in slide-in-from-bottom-2 ${
                        msg.sender === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className={msg.sender === 'ai' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'}>
                        <AvatarFallback>{msg.sender === 'ai' ? '🤖' : '👤'}</AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${msg.sender === 'user' ? 'items-end' : ''}`}>
                        <div
                          className={`rounded-2xl p-4 ${
                            msg.sender === 'ai'
                              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                              : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                          }`}
                        >
                          <p className="text-white">{msg.text}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block px-2">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !messageBlocked && sendMessage()}
                  placeholder="Напиши сообщение..."
                  disabled={messageBlocked}
                  className="bg-muted/50 border-purple-500/30"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={messageBlocked}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Icon name="Send" size={18} />
                </Button>
              </div>

              {messageBlocked && (
                <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                  <Icon name="Clock" size={12} />
                  Подождите 5 секунд между сообщениями
                </p>
              )}

              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="text-xs" onClick={() => setInputText('Как дела?')}>
                  🎮 Как дела?
                </Button>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => setInputText('Запусти игру')}>
                  🎯 Запусти игру
                </Button>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => setInputText('Мой баланс')}>
                  💰 Мой баланс
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="donate" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { amount: 100, label: 'Малый донат', emoji: '💰', color: 'from-yellow-500 to-orange-500' },
                { amount: 500, label: 'Средний донат', emoji: '💎', color: 'from-purple-500 to-pink-500' },
                { amount: 1000, label: 'Большой донат', emoji: '👑', color: 'from-pink-500 to-red-500' },
              ].map((donate) => (
                <Card key={donate.amount} className="bg-card/50 border-purple-500/30 p-6 hover:scale-105 transition-transform cursor-pointer glow-pulse">
                  <div className="text-center space-y-4">
                    <div className="text-6xl">{donate.emoji}</div>
                    <h3 className="font-bold text-xl text-white">{donate.label}</h3>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${donate.color} bg-clip-text text-transparent`}>
                      {donate.amount} руб.
                    </div>
                    <Button
                      onClick={() => triggerDonation(donate.amount, 'Юзер' + Math.floor(Math.random() * 100))}
                      disabled={donationBlocked}
                      className={`w-full bg-gradient-to-r ${donate.color} hover:opacity-90`}
                    >
                      Отправить донат
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="bg-card/50 border-purple-500/30 p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Icon name="Activity" className="text-purple-400" />
                Последние донаты
              </h3>
              <div className="space-y-3">
                {allUsers.slice(0, 4).map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{user.username}</span>
                      {user.isVerified && <Icon name="BadgeCheck" className="text-blue-400" size={16} />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500">
                        {[500, 1000, 100, 500][i]} руб.
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="games" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-card/50 border-purple-500/30 p-8 hover:border-purple-400 transition-all">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎰</div>
                  <h3 className="font-bold text-2xl">Рулетка удачи</h3>
                  <p className="text-muted-foreground">Крути рулетку и выигрывай монеты!</p>
                  <Button
                    onClick={spinRoulette}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 glow-pulse"
                  >
                    <Icon name="Sparkles" size={18} className="mr-2" />
                    Крутить (50 монет)
                  </Button>
                </div>
              </Card>

              <Card className="bg-card/50 border-purple-500/30 p-8">
                <div className="text-center space-y-4">
                  <div className="text-6xl">🎯</div>
                  <h3 className="font-bold text-2xl">Кликер</h3>
                  <div className="text-4xl font-bold text-purple-400">{currentUser.coins}</div>
                  <Button
                    onClick={() => {
                      setCurrentUser({
                        ...currentUser,
                        coins: currentUser.coins + 10,
                        xp: Math.min(100, currentUser.xp + 1),
                        gamesPlayed: currentUser.gamesPlayed + 1
                      });
                    }}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <Icon name="MousePointerClick" size={18} className="mr-2" />
                    Кликнуть (+10)
                  </Button>
                  <p className="text-xs text-muted-foreground">Каждый клик приносит монеты и XP</p>
                </div>
              </Card>
            </div>

            <Card className="bg-card/50 border-purple-500/30 p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Icon name="Trophy" className="text-yellow-400" />
                Лидеры игр
              </h3>
              <div className="space-y-2">
                {[...allUsers, {...currentUser, username: '💎 You'}]
                  .sort((a, b) => b.coins - a.coins)
                  .slice(0, 5)
                  .map((player, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${player.username.includes('You') ? 'bg-purple-500/20 border border-purple-500' : 'bg-muted/20'}`}>
                    <div className="flex items-center gap-3">
                      <Badge className={index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-muted'}>
                        #{index + 1}
                      </Badge>
                      <span className="font-medium flex items-center gap-2">
                        {player.username}
                        {player.isVerified && <Icon name="BadgeCheck" className="text-blue-400" size={16} />}
                      </span>
                    </div>
                    <span className="text-purple-400 font-bold">{player.coins}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="shop" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Множитель XP x2', price: 500, icon: '⚡', desc: 'Удваивает получаемый опыт на 24 часа' },
                { name: 'VIP статус', price: 2000, icon: '👑', desc: 'Эксклюзивный значок и бонусы' },
                { name: 'Цветной ник', price: 300, icon: '🌈', desc: 'Раскрась свой никнейм' },
                { name: 'Донат звук', price: 150, icon: '🔊', desc: 'Уникальный звук при донате' },
                { name: 'Анимация профиля', price: 400, icon: '✨', desc: 'Крутая анимация в профиле' },
                { name: 'Эмодзи пак', price: 250, icon: '😎', desc: '50+ эксклюзивных эмодзи' },
              ].map((item) => (
                <Card key={item.name} className="bg-card/50 border-purple-500/30 p-6 hover:border-purple-400 transition-all">
                  <div className="space-y-3">
                    <div className="text-4xl">{item.icon}</div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-yellow-400 font-bold">
                        <Icon name="Coins" size={16} />
                        {item.price}
                      </div>
                      <Button
                        size="sm"
                        disabled={currentUser.coins < item.price}
                        onClick={() => handlePurchase(item.name, item.price)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500"
                      >
                        Купить
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="bg-card/50 border-purple-500/30 p-6 md:col-span-2">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-purple-400">
                    <AvatarFallback className="text-4xl">👤</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-3xl font-bold">{currentUser.username}</h2>
                      {currentUser.isVerified ? (
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                          <Icon name="BadgeCheck" size={14} className="mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={verifyUser} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                          <Icon name="Mail" size={14} className="mr-1" />
                          Верифицировать
                        </Button>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">@Giga_1bes участник • {currentUser.email}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Уровень {currentUser.level}</span>
                          <span className="text-purple-400">{currentUser.xp}/100 XP</span>
                        </div>
                        <Progress value={currentUser.xp} className="h-3" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{currentUser.coins}</div>
                          <div className="text-xs text-muted-foreground">Монет</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-400">{currentUser.donations}</div>
                          <div className="text-xs text-muted-foreground">Донатов</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400">{currentUser.gamesPlayed}</div>
                          <div className="text-xs text-muted-foreground">Игр</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-card/50 border-purple-500/30 p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Icon name="Award" className="text-yellow-400" />
                  Достижения
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Первый донат', icon: '💰', unlocked: currentUser.donations > 0 },
                    { name: 'Уровень 10', icon: '⭐', unlocked: currentUser.level >= 10 },
                    { name: '100 игр', icon: '🎮', unlocked: currentUser.gamesPlayed >= 100 },
                    { name: 'Верифицирован', icon: '✅', unlocked: currentUser.isVerified },
                  ].map((achievement) => (
                    <div key={achievement.name} className={`flex items-center gap-3 p-2 rounded ${achievement.unlocked ? 'bg-purple-500/20' : 'bg-muted/10 opacity-50'}`}>
                      <span className="text-2xl">{achievement.icon}</span>
                      <span className="text-sm">{achievement.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="bg-card/50 border-purple-500/30 p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Icon name="Scroll" className="text-purple-400" />
                Активные квесты
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Отправить 5 донатов', progress: currentUser.donations, total: 5, reward: 200 },
                  { name: 'Достичь 15 уровня', progress: currentUser.level, total: 15, reward: 500 },
                  { name: 'Выиграть 10 игр', progress: Math.min(currentUser.gamesPlayed, 10), total: 10, reward: 300 },
                ].map((quest) => (
                  <div key={quest.name} className="bg-muted/20 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{quest.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-yellow-400 mt-1">
                          <Icon name="Coins" size={14} />
                          +{quest.reward}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-purple-500/20 text-purple-300">
                        {quest.progress}/{quest.total}
                      </Badge>
                    </div>
                    <Progress value={(quest.progress / quest.total) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {currentUser.isAdmin && (
            <TabsContent value="admin" className="space-y-4">
              <Card className="bg-card/50 border-red-500/30 p-6">
                <h3 className="font-bold text-2xl mb-6 flex items-center gap-2">
                  <Icon name="Shield" className="text-red-400" />
                  Админ панель
                </h3>

                <div className="space-y-4">
                  {allUsers.map((user) => (
                    <Card key={user.email} className="bg-muted/20 p-4">
                      <div className="grid md:grid-cols-5 gap-4 items-center">
                        <div>
                          <div className="font-bold flex items-center gap-2">
                            {user.username}
                            {user.isVerified && <Icon name="BadgeCheck" className="text-blue-400" size={16} />}
                          </div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Label htmlFor={`verify-${user.email}`} className="text-sm">Верификация</Label>
                          <Switch
                            id={`verify-${user.email}`}
                            checked={user.isVerified}
                            onCheckedChange={() => toggleUserVerification(user.email)}
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Монеты</Label>
                          <Input
                            type="number"
                            value={user.coins}
                            onChange={(e) => updateUserData(user.email, 'coins', parseInt(e.target.value))}
                            className="h-8 bg-muted/50"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Уровень</Label>
                          <Input
                            type="number"
                            value={user.level}
                            onChange={(e) => updateUserData(user.email, 'level', parseInt(e.target.value))}
                            className="h-8 bg-muted/50"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-purple-500/20">
                            Донаты: {user.donations}
                          </Badge>
                          <Badge variant="outline" className="bg-cyan-500/20">
                            Игр: {user.gamesPlayed}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <footer className="mt-8 text-center text-muted-foreground text-sm">
          <p>Поддержка: @Devv1_Rbx_bot • Группа: @Giga_1bes</p>
        </footer>
      </div>

      <AlertDialog open={showPurchaseConfirm} onOpenChange={setShowPurchaseConfirm}>
        <AlertDialogContent className="bg-card border-purple-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Icon name="ShoppingCart" className="text-purple-400" />
              Подтверждение покупки
            </AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите купить <span className="font-bold text-purple-400">{purchaseItem?.name}</span> за{' '}
              <span className="font-bold text-yellow-400">{purchaseItem?.price} монет</span>?
              <br />
              <br />
              После покупки у вас останется: <span className="font-bold">{currentUser.coins - (purchaseItem?.price || 0)} монет</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPurchase}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              Купить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
