
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, ShieldCheck } from '../components/Icons';

interface PolicySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function PoliciesPage() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const policies: PolicySection[] = [
    {
      id: 'terms',
      title: 'Termos de Uso',
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p className="font-bold">Última atualização: 03/12/2025</p>
          
          <h4 className="font-bold dark:text-zinc-200 text-gray-800">1. Introdução</h4>
          <p>Este documento estabelece os Termos de Uso da plataforma Caloriz.ai, doravante denominada “Plataforma” ou “Serviço”. Ao criar uma conta, acessar ou utilizar a Plataforma, o usuário declara estar de pleno acordo com todas as condições aqui descritas. Caso não concorde com qualquer cláusula, o usuário não deve utilizar o Serviço.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">2. Objeto da Plataforma</h4>
          <p>A Caloriz.ai oferece funcionalidades voltadas para: Contagem automática e manual de calorias; Estimativa nutricional por IA via fotografia; Dashboard de acompanhamento; Planos de treino e plano alimentar; Recursos exclusivos para assinantes premium. A Plataforma não substitui orientação profissional de nutricionistas, médicos ou educadores físicos.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">3. Elegibilidade</h4>
          <p>O uso é permitido apenas para: Pessoas maiores de 13 anos (com supervisão responsável); Pessoas que concordam integralmente com os Termos; Usuários que forneçam informações verdadeiras no cadastro.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">4. Conta do Usuário</h4>
          <p>Ao criar uma conta, o usuário concorda em fornecer dados válidos e manter sua senha segura. O sistema de login é vinculado ao Supabase e requer validação por e-mail.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">5. Uso da Plataforma</h4>
          <p>É proibido: Engenharia reversa, compartilhamento de acesso, uso comercial sem autorização, difamação ou fraude.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">6. Assinaturas, Trial e Pagamentos</h4>
          <p>O plano premium é cobrado mensal ou anualmente. O trial gratuito possui duração de 3 dias. Ao expirar o trial, o acesso é bloqueado até a contratação.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">7. Cancelamento</h4>
          <p>O usuário pode solicitar cancelamento diretamente na Plataforma. O cancelamento não gera reembolso automático.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">8. Suspensão ou Banimento</h4>
          <p>A Plataforma reserva-se o direito de suspender contas que violem estes Termos ou pratiquem chargeback indevido.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">9. Registros e Auditoria</h4>
          <p>Registramos automaticamente: Data/hora de login, dispositivo, páginas acessadas, tempo de sessão e ações relevantes para proteção legal.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">10. Limitação de Responsabilidade</h4>
          <p>A Plataforma não se responsabiliza por resultados estéticos, físicos ou decisões alimentares tomadas com base apenas nas estimativas da IA.</p>
        </div>
      )
    },
    {
      id: 'refund',
      title: 'Política de Reembolso',
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p className="font-bold">Última atualização: 03/12/2025</p>
          <p>A Caloriz.ai oferece garantia de 7 dias após a aprovação da assinatura, conforme previsto no Código de Defesa do Consumidor (CDC).</p>
          
          <h4 className="font-bold dark:text-zinc-200 text-gray-800">1. Requisitos para Reembolso</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Estar dentro do período de 7 dias;</li>
            <li>Assinatura aprovada;</li>
            <li>Pedido feito pelo canal oficial.</li>
          </ul>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">2. Casos onde NÃO há Reembolso</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Uso comprovado após 7 dias;</li>
            <li>Tentativas de fraude ou má fé;</li>
            <li>Chargeback solicitado sem contato prévio.</li>
          </ul>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">3. Como Solicitar</h4>
          <p>O pedido deve ser feito pelo botão de reembolso dentro do aplicativo ou por contato via suporte. Prazo de processamento: até 7 dias úteis.</p>
        </div>
      )
    },
    {
      id: 'chargeback',
      title: 'Política Anti-Chargeback',
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
           <p>O objetivo desta política é proteger a empresa e os usuários de fraudes.</p>

           <h4 className="font-bold dark:text-zinc-200 text-gray-800">Conduta da Empresa</h4>
           <p>Em caso de chargeback, enviaremos ao banco: registros de uso, logs de acesso, aceitação dos termos e confirmação de assinatura.</p>

           <h4 className="font-bold dark:text-zinc-200 text-gray-800">Consequências</h4>
           <p>Chargebacks fraudulentos resultarão em cancelamento da conta, banimento permanente e possível ação legal.</p>
        </div>
      )
    },
    {
        id: 'warranty',
        title: 'Política de Garantia',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <p>A Caloriz.ai fornece garantia de 7 dias corridos após a aprovação da assinatura. A garantia cobre apenas o valor pago e não se aplica se o usuário abriu chargeback antes de solicitar reembolso ou apresentou uso extensivo após o prazo legal.</p>
          </div>
        )
    },
    {
        id: 'subs',
        title: 'Termos de Assinatura',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <p><span className="font-bold">Modelos:</span> Mensal (R$19,90) e Anual (R$127,00).</p>
             <p><span className="font-bold">Renovação:</span> Automática até cancelamento.</p>
             <p><span className="font-bold">Cancelamento:</span> Pode ser feito a qualquer momento, sem reembolso dos dias já utilizados.</p>
             <p><span className="font-bold">Bloqueio:</span> Após 24h sem pagamento, o acesso premium é suspenso.</p>
          </div>
        )
    },
    {
        id: 'dispute',
        title: 'Declaração em Caso de Disputa',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl">
             <p className="font-bold text-xs uppercase mb-2">Transparência</p>
             <p>Em caso de abertura de disputa bancária (chargeback) indevida, a Caloriz.ai utiliza o seguinte modelo de declaração para comprovação de serviço prestado:</p>
             <div className="italic text-xs border-l-2 border-red-500 pl-3 py-1">
                 "Eu, responsável pela plataforma Caloriz.ai, declaro que o usuário [NOME], realizou assinatura voluntária, aceitou os Termos de Uso e utilizou a plataforma conforme comprovado pelos registros anexos (Logins, Páginas Acessadas, etc). O serviço é digital e foi entregue imediatamente."
             </div>
          </div>
        )
    },
    {
        id: 'cookies',
        title: 'Política de Cookies',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <p>Utilizamos cookies essenciais (login/segurança), funcionais (preferências) e analíticos (desempenho). Ao utilizar a plataforma, você aceita este uso.</p>
          </div>
        )
    },
    {
        id: 'ai',
        title: 'Termos de Licença de IA',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <p>O usuário entende que a IA fornece estimativas aproximadas e pode conter margens de erro. A IA não identifica patologias. Todo algoritmo é propriedade exclusiva da Caloriz.ai.</p>
          </div>
        )
    },
    {
        id: 'resp',
        title: 'Responsabilidade Nutricional',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <p className="font-bold text-red-500">A Caloriz.ai não substitui nutricionistas.</p>
             <p>A plataforma fornece estimativas baseadas em imagem. Toda decisão alimentar deve ser acompanhada por profissional da área.</p>
          </div>
        )
    },
     {
        id: 'contact',
        title: 'Canais de Contato',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <p>Para suporte, dúvidas ou solicitações de reembolso, entre em contato através dos nossos canais:</p>
             <div className="space-y-2 mt-4">
                 <p className="font-bold text-red-600 flex items-center gap-2">
                     ✉️ sac.caloriz@outlook.com
                 </p>
                 <p className="font-bold text-green-600 flex items-center gap-2">
                     📱 (11) 95034-7959 (WhatsApp)
                 </p>
             </div>
          </div>
        )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-white pb-10 transition-colors animate-fade-in">
       {/* Header */}
       <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 p-4 flex items-center gap-4">
            <button 
                onClick={() => navigate('/profile')} 
                className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
                <ChevronLeft size={20} className="dark:text-white" />
            </button>
            <h1 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck size={20} className="text-red-600" />
                Políticas e Termos
            </h1>
       </div>

       <div className="max-w-md mx-auto p-6 space-y-4">
            <p className="text-sm text-zinc-500 mb-6">
                Para garantir transparência e segurança, listamos abaixo todos os documentos legais que regem o uso da Caloriz.ai.
            </p>

            {policies.map((policy) => (
                <div key={policy.id} className="bg-white dark:bg-[#18181b] rounded-2xl overflow-hidden shadow-sm dark:shadow-none border border-gray-100 dark:border-zinc-800 transition-all">
                    <button 
                        onClick={() => toggleSection(policy.id)}
                        className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                        <span className="font-bold dark:text-white text-gray-900">{policy.title}</span>
                        {openSection === policy.id ? (
                            <ChevronUp size={18} className="text-red-600" />
                        ) : (
                            <ChevronDown size={18} className="text-zinc-400" />
                        )}
                    </button>
                    
                    {openSection === policy.id && (
                        <div className="p-5 pt-0 animate-slide-up border-t border-gray-100 dark:border-zinc-800/50 mt-2">
                             {policy.content}
                        </div>
                    )}
                </div>
            ))}

            <div className="text-center pt-8 text-xs text-zinc-400">
                Caloriz.ai © 2025. Todos os direitos reservados.
            </div>
       </div>
    </div>
  );
}
