'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaCheck, FaPlus, FaChevronLeft, FaChevronRight, FaBook, FaImage, FaTrash, FaStar, FaGamepad, FaClock } from 'react-icons/fa';
import { GiStonePath } from 'react-icons/gi';

export default function Home() {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({
    title: '',
    platform: '',
    platinum: false,
    completed: false,
    imageUrl: '',
    imageFile: null,
    hours: '',
    experience: '',
    rating: 0,
    difficulty: 'medium'
  });
  const [page, setPage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  // --- START: ADDED CODE ---
  useEffect(() => {
    async function fetchGames() {
      try {
        const response = await fetch('/api/games'); // Call your API route
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Failed to fetch games:", error);
      }
    }
    fetchGames();
  }, []); // Empty dependency array means this runs once on mount
  // --- END: ADDED CODE ---



  const handleRemoveImage = () => {
    setNewGame({ ...newGame, imageUrl: '', imageFile: null });
    setPreviewImage(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const gameData = {
    title: newGame.title,
    platform: newGame.platform,
    platinum: newGame.platinum,
    completed: newGame.completed,
    imageUrl: newGame.imageUrl || 'https://via.placeholder.com/400x225/333/666?text=No+Image',
    hours: newGame.hours,
    experience: newGame.experience,
    rating: newGame.rating,
    difficulty: newGame.difficulty
  };

  try {
    const response = await fetch('/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const addedGame = await response.json(); // O jogo adicionado com o ID retornado pelo servidor
    setGames([...games, addedGame]); // Atualiza o estado local com o jogo que veio do servidor

    // Limpa o formulário e o preview da imagem
    setNewGame({ 
      title: '', 
      platform: '', 
      platinum: false, 
      completed: false,
      imageUrl: '',
      imageFile: null,
      hours: '',
      experience: '',
      rating: 0,
      difficulty: 'medium'
    });
    setPreviewImage(null);
    setIsAdding(false);
    // Ajusta a página para mostrar o novo jogo se necessário
    setPage(Math.floor(games.length / gamesPerPage)); // Ajuste para ir para a última página ou página onde o jogo foi adicionado
  } catch (error) {
    console.error("Erro ao adicionar jogo:", error);
    alert('Erro ao adicionar o jogo. Por favor, tente novamente.');
  }
};

  const gamesPerPage = 2;
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const currentGames = games.slice(page * gamesPerPage, page * gamesPerPage + gamesPerPage);

  const renderStars = (rating, gameId = null) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-xl cursor-pointer ${(gameId ? rating : (hoverRating || newGame.rating)) >= star ? 'text-yellow-400' : 'text-gray-500'}`}
            onMouseEnter={!gameId ? () => setHoverRating(star) : null}
            onMouseLeave={!gameId ? () => setHoverRating(0) : null}
            onClick={!gameId ? () => setNewGame({...newGame, rating: star}) : null}
          />
        ))}
      </div>
    );
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch(difficulty) {
      case 'easy': return '😊';
      case 'medium': return '😐';
      case 'hard': return '😰';
      default: return '🎮';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2"
          >
            Minha Biblioteca de Jogos
          </motion.h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Registre suas conquistas, horas jogadas e experiências com seus jogos favoritos
          </p>
        </header>

        {/* Botão de adicionar (flutuante) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-lg z-10 flex items-center gap-2 transition-all"
        >
          <FaPlus size={20} />
          <span className="hidden md:inline">Adicionar Jogo</span>
        </motion.button>

        {/* Modal de adição */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 p-4"
              onClick={() => setIsAdding(false)}
            >
              <motion.form
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onSubmit={handleSubmit}
                onClick={e => e.stopPropagation()}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-700"
              >
                <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Adicionar novo jogo
                </h2>
                
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"> {/* Adicione pr-2 e custom-scrollbar para evitar que a barra de rolagem corte o conteúdo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
                    <input
                      type="text"
                      placeholder="Ex: The Last of Us Part II"
                      value={newGame.title}
                      onChange={e => setNewGame({ ...newGame, title: e.target.value })}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Plataforma</label>
                    <input
                      type="text"
                      placeholder="Ex: PS5, PC, Xbox"
                      value={newGame.platform}
                      onChange={e => setNewGame({ ...newGame, platform: e.target.value })}
                      required
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                    />
                  </div>

                  {/* Seção de Imagem */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Imagem do Jogo</label>
                    
                    {/* Pré-visualização da imagem */}
                    {(previewImage || newGame.imageUrl) && (
                      <div className="mb-3 relative group">
                        <img 
                          src={previewImage || newGame.imageUrl} 
                          alt="Preview" 
                          className="w-full h-40 object-cover rounded-lg border border-gray-600 transition-transform group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}
                    
              
                    
            
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-400 text-sm">ou</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Cole a URL da imagem"
                        value={newGame.imageUrl}
                        onChange={e => setNewGame({ ...newGame, imageUrl: e.target.value })}
                        className="w-full p-3 pl-12 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 cursor-pointer p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                      <input
                        type="checkbox"
                        checked={newGame.platinum}
                        onChange={e => setNewGame({ ...newGame, platinum: e.target.checked })}
                        className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500 bg-gray-700 border-gray-600"
                      />
                      <span className="flex items-center gap-2 font-medium">
                        <FaTrophy className="text-yellow-400 text-lg" /> Platinado
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 cursor-pointer p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                      <input
                        type="checkbox"
                        checked={newGame.completed}
                        onChange={e => setNewGame({ ...newGame, completed: e.target.checked })}
                        className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500 bg-gray-700 border-gray-600"
                      />
                      <span className="flex items-center gap-2 font-medium">
                        <FaCheck className="text-green-400 text-lg" /> Zerado
                      </span>
                    </div>
                  </div>

                  {/* Campo de Horas Jogadas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Horas Jogadas</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <FaClock className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Ex: 50h, 120 horas"
                        value={newGame.hours}
                        onChange={e => setNewGame({ ...newGame, hours: e.target.value })}
                        className="w-full p-3 pl-10 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Campo de Dificuldade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Dificuldade</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['easy', 'medium', 'hard'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setNewGame({...newGame, difficulty: level})}
                          className={`p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${newGame.difficulty === level ? getDifficultyColor(level) + ' scale-95' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                          <span className="text-lg">{getDifficultyIcon(level)}</span>
                          <span className="capitalize">{level}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Campo de Avaliação */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Avaliação</label>
                    <div className="p-3 bg-gray-700 rounded-lg">
                      {renderStars()}
                      <div className="mt-2 text-sm text-gray-400">
                        {hoverRating > 0 ? `Avaliar com ${hoverRating} estrela${hoverRating > 1 ? 's' : ''}` : 
                          newGame.rating > 0 ? `Avaliado com ${newGame.rating} estrela${newGame.rating > 1 ? 's' : ''}` : 
                          'Selecione sua avaliação'}
                      </div>
                    </div>
                  </div>

                  {/* Campo de Experiência */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Minha Experiência</label>
                    <textarea
                      placeholder="Conte sobre sua experiência jogando este game..."
                      value={newGame.experience}
                      onChange={e => setNewGame({ ...newGame, experience: e.target.value })}
                      rows="4"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 resize-y"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => {
                      setIsAdding(false);
                      setNewGame({ 
                        title: '', 
                        platform: '', 
                        platinum: false, 
                        completed: false,
                        imageUrl: '',
                        imageFile: null,
                        hours: '',
                        experience: '',
                        rating: 0,
                        difficulty: 'medium'
                      });
                      setPreviewImage(null);
                    }}
                    className="px-5 py-2.5 text-gray-300 hover:bg-gray-700 rounded-lg transition-all font-medium"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow hover:from-purple-700 hover:to-pink-700 transition-all font-medium flex items-center gap-2"
                  >
                    <FaPlus /> Adicionar Jogo
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Livro de Jogos */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-4xl mx-auto aspect-[3/4] md:aspect-[4/3] bg-gray-900 rounded-xl shadow-2xl overflow-hidden border-8 border-gray-800 hover:shadow-purple-500/20 transition-shadow duration-300"
        >
          {/* Efeito de brilho sutil */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500 rounded-full filter blur-3xl opacity-10"></div>
          </div>
          
          {/* Páginas do livro */}
          <div className="absolute inset-0 flex">
            {/* Página esquerda */}
            <div className="w-1/2 h-full bg-gradient-to-b from-gray-800 to-gray-900 p-6 md:p-8 border-r border-gray-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-10 pointer-events-none"></div>
              
              {currentGames[0] ? (
                <motion.div
                  key={`left-${page}-${currentGames[0].id}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="relative h-full flex flex-col"
                >
                  {/* Imagem do jogo */}
                  {currentGames[0].imageUrl && (
                    <div className="mb-4 h-40 w-full overflow-hidden rounded-xl border border-gray-700 shadow-lg group">
                      <img 
                        src={currentGames[0].imageUrl} 
                        alt={currentGames[0].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x225/333/666?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400 mb-2">
                    {currentGames[0].title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-sm md:text-base text-gray-300 bg-gray-700 px-3 py-1 rounded-full flex items-center gap-1">
                      <FaGamepad /> {currentGames[0].platform}
                    </span>
                    
                    <span className={`text-sm md:text-base text-white px-3 py-1 rounded-full flex items-center gap-1 ${getDifficultyColor(currentGames[0].difficulty)}`}>
                      {getDifficultyIcon(currentGames[0].difficulty)} {currentGames[0].difficulty.charAt(0).toUpperCase() + currentGames[0].difficulty.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-2 space-y-3">
                    <div className={`flex items-center gap-3 text-lg ${currentGames[0].platinum ? 'text-yellow-400' : 'text-gray-500'}`}>
                      <FaTrophy className="text-xl" />
                      <span>Platinado: {currentGames[0].platinum ? 'Sim 🎉' : 'Não'}</span>
                    </div>
                    
                    <div className={`flex items-center gap-3 text-lg ${currentGames[0].completed ? 'text-green-400' : 'text-gray-500'}`}>
                      <FaCheck className="text-xl" />
                      <span>Zerado: {currentGames[0].completed ? 'Sim ✅' : 'Não'}</span>
                    </div>

                    {/* Horas Jogadas */}
                    {currentGames[0].hours && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaClock className="text-xl text-purple-400" />
                        <span>
                          <span className="font-semibold">Horas Jogadas:</span> {currentGames[0].hours}
                        </span>
                      </div>
                    )}

                    {/* Avaliação */}
                    <div className="flex items-center gap-3">
                      <FaStar className="text-xl text-yellow-400" />
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-300">Avaliação:</span>
                        {renderStars(currentGames[0].rating, currentGames[0].id)}
                      </div>
                    </div>
                    
                    {/* Experiência */}
                    {currentGames[0].experience && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-purple-300 mb-2">
                          <GiStonePath className="text-xl" />
                          <span className="font-semibold">Minha Jornada:</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed bg-gray-700/50 p-3 rounded-lg">
                          {currentGames[0].experience}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {currentGames[0].platinum && (
                    <div className="mt-auto self-end">
                      <div className="text-6xl text-yellow-500 opacity-20 hover:opacity-40 transition-opacity">🏆</div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <FaGamepad className="text-5xl text-gray-600 mb-4" />
                  <p className="text-gray-600 italic text-lg">Página vazia</p>
                  <p className="text-gray-700 text-sm mt-2">Adicione um jogo para começar sua coleção</p>
                </div>
              )}
            </div>

            {/* Página direita */}
            <div className="w-1/2 h-full bg-gradient-to-b from-gray-800 to-gray-900 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-geometric.png')] opacity-10 pointer-events-none"></div>
              
              {currentGames[1] ? (
                <motion.div
                  key={`right-${page}-${currentGames[1].id}`}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="relative h-full flex flex-col"
                >
                  {/* Imagem do jogo */}
                  {currentGames[1].imageUrl && (
                    <div className="mb-4 h-40 w-full overflow-hidden rounded-xl border border-gray-700 shadow-lg group">
                      <img 
                        src={currentGames[1].imageUrl} 
                        alt={currentGames[1].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x225/333/666?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400 mb-2">
                    {currentGames[1].title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-sm md:text-base text-gray-300 bg-gray-700 px-3 py-1 rounded-full flex items-center gap-1">
                      <FaGamepad /> {currentGames[1].platform}
                    </span>
                    
                    <span className={`text-sm md:text-base text-white px-3 py-1 rounded-full flex items-center gap-1 ${getDifficultyColor(currentGames[1].difficulty)}`}>
                      {getDifficultyIcon(currentGames[1].difficulty)} {currentGames[1].difficulty.charAt(0).toUpperCase() + currentGames[1].difficulty.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-2 space-y-3">
                    <div className={`flex items-center gap-3 text-lg ${currentGames[1].platinum ? 'text-yellow-400' : 'text-gray-500'}`}>
                      <FaTrophy className="text-xl" />
                      <span>Platinado: {currentGames[1].platinum ? 'Sim 🎉' : 'Não'}</span>
                    </div>
                    
                    <div className={`flex items-center gap-3 text-lg ${currentGames[1].completed ? 'text-green-400' : 'text-gray-500'}`}>
                      <FaCheck className="text-xl" />
                      <span>Zerado: {currentGames[1].completed ? 'Sim ✅' : 'Não'}</span>
                    </div>

                    {/* Horas Jogadas */}
                    {currentGames[1].hours && (
                      <div className="flex items-center gap-3 text-gray-300">
                        <FaClock className="text-xl text-purple-400" />
                        <span>
                          <span className="font-semibold">Horas Jogadas:</span> {currentGames[1].hours}
                        </span>
                      </div>
                    )}

                    {/* Avaliação */}
                    <div className="flex items-center gap-3">
                      <FaStar className="text-xl text-yellow-400" />
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-300">Avaliação:</span>
                        {renderStars(currentGames[1].rating, currentGames[1].id)}
                      </div>
                    </div>
                    
                    {/* Experiência */}
                    {currentGames[1].experience && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-purple-300 mb-2">
                          <GiStonePath className="text-xl" />
                          <span className="font-semibold">Minha Jornada:</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed bg-gray-700/50 p-3 rounded-lg">
                          {currentGames[1].experience}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {currentGames[1].completed && (
                    <div className="mt-auto self-end">
                      <div className="text-6xl text-green-500 opacity-20 hover:opacity-40 transition-opacity">🎮</div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <FaPlus className="text-5xl text-gray-600 mb-4" />
                  <p className="text-gray-600 italic text-lg">Página vazia</p>
                  <p className="text-gray-700 text-sm mt-2">Clique no botão + para adicionar outro jogo</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Controles de navegação */}
        <div className="flex justify-center mt-8 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-5 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg shadow hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:hover:from-gray-700 disabled:hover:to-gray-800 transition-all flex items-center gap-2 font-medium"
          >
            <FaChevronLeft /> Anterior
          </motion.button>
          
          <div className="flex items-center px-5 bg-gray-700 text-purple-300 rounded-lg font-medium shadow-inner border border-gray-600">
            Página {page + 1} de {totalPages || 1}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:hover:from-purple-600 disabled:hover:to-pink-600 transition-all flex items-center gap-2 font-medium"
          >
            Próxima <FaChevronRight />
          </motion.button>
        </div>
      </div>
    </main>
  );
}