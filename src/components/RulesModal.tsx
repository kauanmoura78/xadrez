import React from 'react';
import { BookOpen, Shield, Crown, Zap, AlertTriangle } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-800/80 border-b border-zinc-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 leading-tight">Regras Completas do Xadrez</h2>
              <p className="text-xs text-zinc-400">Tudo o que você precisa saber para dominar os movimentos especiais.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-2 text-sm rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            ✕ Fechar
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-zinc-300">
          <div className="p-3.5 bg-zinc-800/60 rounded-xl border border-zinc-700/60">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>O Roque (Pequeno e Grande)</span>
            </h3>
            <p className="leading-relaxed">
              O roque é o único lance onde duas peças se movem simultaneamente. O Rei anda duas casas em direção à Torre, e a Torre pula para a casa ao lado do Rei.
            </p>
            <div className="mt-2 text-zinc-400 space-y-1">
              <div>• Nem o Rei nem a Torre escolhida podem ter se movido anteriormente.</div>
              <div>• Todas as casas entre eles devem estar livres de outras peças.</div>
              <div>• O Rei não pode estar em xeque, nem passar por uma casa atacada por peça inimiga.</div>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-800/60 rounded-xl border border-zinc-700/60">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Captura En Passant (De Passagem)</span>
            </h3>
            <p className="leading-relaxed">
              Quando um peão inimigo avança 2 casas na sua primeira jogada e fica lado a lado com um peão seu, você pode capturá-lo na diagonal como se ele tivesse andado apenas 1 casa.
            </p>
            <div className="mt-2 text-zinc-400">
              • Esta captura especial deve ser feita obrigatoriamente no lance imediatamente seguinte; caso contrário, o direito é perdido.
            </div>
          </div>

          <div className="p-3.5 bg-zinc-800/60 rounded-xl border border-zinc-700/60">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-1.5">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span>Promoção do Peão</span>
            </h3>
            <p className="leading-relaxed">
              Ao alcançar a oitava fileira adversária (ou primeira, no caso das pretas), o peão é imediatamente promovido a uma nova Dama, Torre, Bispo ou Cavalo, à sua escolha.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-800/60 rounded-xl border border-zinc-700/60">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Xeque, Xeque-Mate e Empate</span>
            </h3>
            <p className="leading-relaxed">
              <strong className="text-zinc-200">Xeque:</strong> Quando o Rei está sob ataque direto. A ameaça deve ser resolvida imediatamente fugindo com o Rei, capturando a peça atacante ou bloqueando o ataque.
            </p>
            <p className="leading-relaxed mt-1">
              <strong className="text-zinc-200">Xeque-mate:</strong> O Rei está em xeque e não existe nenhuma jogada legal para escapar. A partida termina com a vitória do atacante.
            </p>
            <p className="leading-relaxed mt-1">
              <strong className="text-zinc-200">Empate (Afogamento):</strong> O jogador não está em xeque, mas não possui nenhum lance legal disponível. Outros empates ocorrem por repetição tripla, regra dos 50 lances ou material insuficiente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
