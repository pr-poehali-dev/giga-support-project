import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [coins, setCoins] = useState(1250);
  const [level, setLevel] = useState(12);
  const [xp, setXp] = useState(65);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Привет! Я твой AI-ассистент 🤖', sender: 'ai', time: '14:20' },
    { id: 2, text: 'Как дела?', sender: 'user', time: '14:21' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMsg = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setInputText('');
    
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

  const triggerDonation = (amount: number, username: string) => {
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
            <div className="text-lg">{username} отправил {amount} руб.</div>
          </div>
        </div>
      </div>
    ));
    
    setCoins(coins + amount);
  };

  const spinRoulette = () => {
    const win = Math.floor(Math.random() * 500) + 50;
    setCoins(coins + win);
    setXp(Math.min(100, xp + 5));
    toast.success(`🎰 Выиграл ${win} монет!`, {
      description: '+5 XP',
    });
  };

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
                <span className="font-bold text-xl text-yellow-400 coin-float">{coins}</span>
              </div>
            </Card>
            
            <Card className="bg-card/50 border-purple-500/30 px-4 py-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500">
                  LVL {level}
                </Badge>
                <div className="w-20">
                  <Progress value={xp} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </header>

        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-card/50 p-1">
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
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Напиши сообщение..."
                  className="bg-muted/50 border-purple-500/30"
                />
                <Button onClick={sendMessage} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Icon name="Send" size={18} />
                </Button>
              </div>

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
                {['👤 User123', '🎮 ProGamer', '⭐ MegaFan', '🔥 TopDonator'].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <span className="text-white">{user}</span>
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
                  <div className="text-4xl font-bold text-purple-400">{coins}</div>
                  <Button
                    onClick={() => {
                      setCoins(coins + 10);
                      setXp(Math.min(100, xp + 1));
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
                {[
                  { name: '👑 ProGamer228', score: 15420, rank: 1 },
                  { name: '⭐ MegaPlayer', score: 12350, rank: 2 },
                  { name: '🔥 TopWinner', score: 9870, rank: 3 },
                  { name: '💎 You', score: coins, rank: 4 },
                ].map((player) => (
                  <div key={player.rank} className={`flex items-center justify-between p-3 rounded-lg ${player.name.includes('You') ? 'bg-purple-500/20 border border-purple-500' : 'bg-muted/20'}`}>
                    <div className="flex items-center gap-3">
                      <Badge className={player.rank === 1 ? 'bg-yellow-500' : player.rank === 2 ? 'bg-gray-400' : player.rank === 3 ? 'bg-orange-600' : 'bg-muted'}>
                        #{player.rank}
                      </Badge>
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <span className="text-purple-400 font-bold">{player.score}</span>
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
                        disabled={coins < item.price}
                        onClick={() => {
                          if (coins >= item.price) {
                            setCoins(coins - item.price);
                            toast.success(`Куплено: ${item.name}! 🎉`);
                          }
                        }}
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
                      <h2 className="text-3xl font-bold">ProGamer</h2>
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">VIP</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">@Giga_1bes участник</p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Уровень {level}</span>
                          <span className="text-purple-400">{xp}/100 XP</span>
                        </div>
                        <Progress value={xp} className="h-3" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-2">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{coins}</div>
                          <div className="text-xs text-muted-foreground">Монет</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-400">24</div>
                          <div className="text-xs text-muted-foreground">Донатов</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cyan-400">156</div>
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
                    { name: 'Первый донат', icon: '💰', unlocked: true },
                    { name: 'Уровень 10', icon: '⭐', unlocked: true },
                    { name: '100 игр', icon: '🎮', unlocked: true },
                    { name: 'VIP статус', icon: '👑', unlocked: false },
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
                  { name: 'Отправить 5 донатов', progress: 2, total: 5, reward: 200 },
                  { name: 'Достичь 15 уровня', progress: 12, total: 15, reward: 500 },
                  { name: 'Выиграть 10 игр', progress: 7, total: 10, reward: 300 },
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
        </Tabs>

        <footer className="mt-8 text-center text-muted-foreground text-sm">
          <p>Поддержка: @Devv1_Rbx_bot • Группа: @Giga_1bes</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
