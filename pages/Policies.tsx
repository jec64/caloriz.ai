
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
          <h4 className="font-bold dark:text-zinc-200 text-gray-800">1. Introdução</h4>
          <p>Este documento estabelece os Termos de Uso da plataforma Caloriz.ai, doravante denominada “Plataforma” ou “Serviço”. Ao criar uma conta, acessar ou utilizar a Plataforma, o usuário declara estar de pleno acordo com todas as condições aqui descritas. Caso não concorde com qualquer cláusula, o usuário não deve utilizar o Serviço.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">2. Objeto da Plataforma</h4>
          <p>A Caloriz.ai oferece funcionalidades voltadas para: Contagem automática e manual de calorias; Estimativa nutricional por IA via fotografia (calorias, proteínas, carboidratos, gorduras e fibras); Dashboard de acompanhamento; Planos de treino e plano alimentar; Recursos exclusivos para assinantes premium; Acompanhamento e monitoramento do uso do Serviço; Controle de assinatura, cancelamento e trial. A Plataforma não substitui orientação profissional de nutricionistas, médicos ou educadores físicos.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">3. Elegibilidade</h4>
          <p>O uso é permitido apenas para: Pessoas maiores de 13 anos (com supervisão responsável); Pessoas que concordam integralmente com os Termos; Usuários que forneçam informações verdadeiras no cadastro.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">4. Conta do Usuário</h4>
          <p>Ao criar uma conta, o usuário concorda em: Fornecer nome, e-mail, telefone e senha válidos; Manter os dados atualizados; Não compartilhar credenciais com terceiros; Responsabilizar-se por todas as ações realizadas em sua conta. O sistema de login é vinculado ao Supabase e requer validação por código enviado ao e-mail.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">5. Uso da Plataforma</h4>
          <p>O usuário concorda em utilizar o Serviço para fins lícitos e adequados, sendo proibido: Tentativas de engenharia reversa; Compartilhamento de acesso; Uso para fins comerciais sem autorização; Difamação, fraude ou má fé.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">6. Assinaturas, Trial e Pagamentos</h4>
          <p>O plano premium é cobrado mensal ou anualmente. O trial gratuito possui duração de 3 dias, sem cobrança inicial. Ao expirar o trial, o acesso é bloqueado até a contratação de um plano. O gateway enviará um webhook confirmando aprovação ou reprovação da compra, determinando o status da conta.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">7. Cancelamento</h4>
          <p>O usuário pode solicitar cancelamento diretamente na Plataforma. O cancelamento não gera reembolso automático, seguindo a política de reembolso descrita neste documento.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">8. Suspensão ou Banimento</h4>
          <p>A Plataforma reserva-se o direito de suspender ou encerrar contas que: violem estes Termos; pratiquem chargeback indevido; utilizem a Plataforma de forma abusiva ou fraudulenta. Em caso de banimento, a plataforma exibirá notificação permanente e justificativa registrada.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">9. Registros e Auditoria</h4>
          <p>Para proteção da empresa e dos usuários, registramos automaticamente: Data e horário de cada login; Dispositivo; Páginas acessadas; Tempo de sessão; Ações relevantes dentro da plataforma; Status da assinatura; Histórico de pagamentos. Esses registros podem ser utilizados em disputas, auditorias e investigações internas.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">10. Limitação de Responsabilidade</h4>
          <p>A Plataforma não se responsabiliza por: danos indiretos resultantes do uso; expectativas não atendidas; resultados estéticos, físicos ou nutricionais; decisões alimentares tomadas com base apenas nas estimativas da IA.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">11. Modificações</h4>
          <p>A Caloriz.ai pode atualizar estes Termos a qualquer momento. A continuidade do uso significa concordância com as alterações.</p>
        </div>
      )
    },
    {
      id: 'refund',
      title: 'Política de Reembolso',
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
          <p>A Caloriz.ai oferece garantia de 7 dias após a aprovação da assinatura, conforme previsto no Código de Defesa do Consumidor (CDC) para compras digitais.</p>
          
          <h4 className="font-bold dark:text-zinc-200 text-gray-800">1. Requisitos para Reembolso</h4>
          <p>O usuário poderá solicitar reembolso quando: estiver dentro do período de 7 dias; a assinatura tiver sido aprovada; o pedido for feito pelo canal oficial.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">2. Casos em que o Reembolso NÃO é concedido</h4>
          <p>Uso comprovado da plataforma após o período de 7 dias; Tentativas de fraude ou má fé; Uso intensivo da plataforma com posterior solicitação para prejudicar o negócio; Chargeback solicitado sem tentativa prévia de contato.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">3. Como Solicitar o Reembolso</h4>
          <p>O pedido deve ser feito pelo botão de reembolso dentro do aplicativo ou por contato via suporte. O prazo para processamento é de até 7 dias úteis.</p>

          <h4 className="font-bold dark:text-zinc-200 text-gray-800">4. Registros de Uso</h4>
          <p>Informações de login, tempo de uso e páginas acessadas podem ser utilizadas para análise da solicitação e comprovação perante bancos e operadoras.</p>
        </div>
      )
    },
    {
      id: 'chargeback',
      title: 'Política Anti-Chargeback',
      content: (
        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
           <p>O objetivo desta política é proteger a empresa e os usuários de fraudes e solicitações indevidas.</p>

           <h4 className="font-bold dark:text-zinc-200 text-gray-800">1. O que é chargeback</h4>
           <p>Chargeback é a contestação da cobrança junto ao banco.</p>

           <h4 className="font-bold dark:text-zinc-200 text-gray-800">2. Conduta da Empresa</h4>
           <p>Em caso de chargeback, a empresa enviará ao banco: registros de uso do aluno; datas e horas de login; atividades realizadas; aceitação dos termos; confirmação de assinatura; acesso ao plano premium e recursos utilizados.</p>

           <h4 className="font-bold dark:text-zinc-200 text-gray-800">3. Conduta do Usuário</h4>
           <p>O usuário concorda em: não solicitar chargeback de forma indevida; contactar o suporte antes de abrir disputa; respeitar a política de reembolso e garantia. Chargebacks fraudulentos resultarão em: cancelamento de conta; banimento permanente; possível ação legal.</p>
        </div>
      )
    },
    {
        id: 'warranty',
        title: 'Política de Garantia',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">1. Garantia Legal</h4>
             <p>A Caloriz.ai fornece garantia de 7 dias corridos após a aprovação da assinatura.</p>
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">2. Limitações</h4>
             <p>A garantia cobre apenas o valor pago pela assinatura e não se aplica quando: a solicitação ocorre após o prazo legal; o usuário apresentou uso relevante da plataforma; o usuário abriu chargeback antes de solicitar reembolso.</p>
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">3. Procedimentos</h4>
             <p>A análise leva em consideração: datas de login, páginas acessadas, duração da sessão, utilização dos recursos premium.</p>
          </div>
        )
    },
    {
        id: 'subs',
        title: 'Termos de Assinatura',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">1. Modelos de Assinatura</h4>
             <p>Mensal — R$19,90</p>
             <p>Anual — R$127,00</p>
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">2. Renovação Automática</h4>
             <p>As assinaturas são renovadas automaticamente até cancelamento do usuário.</p>
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">3. Cancelamento</h4>
             <p>O usuário pode cancelar quando quiser, porém não haverá reembolso dos períodos já utilizados.</p>
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">4. Bloqueio por Falha no Pagamento</h4>
             <p>Em caso de reprovação no cartão, o sistema exibirá aviso. Após 24h sem regularização, o acesso premium é suspenso.</p>
          </div>
        )
    },
    {
        id: 'dispute',
        title: 'Declaração Oficial para Disputas',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl">
             <p className="font-bold text-xs uppercase mb-2">Declaração de Prestação de Serviço Digital</p>
             <div className="italic text-xs border-l-2 border-red-500 pl-3 py-1">
                 "Eu, responsável pela plataforma Caloriz.ai, declaro que o usuário [NOME COMPLETO], e-mail [EMAIL], realizou assinatura voluntária do plano [MENSAL/ANUAL] na data [DATA], aceitou os Termos de Uso e utilizou a plataforma conforme comprovado pelos registros anexos: Data e hora de logins; Duração da sessão; Páginas acessadas; Acesso a conteúdo exclusivo; Utilização dos recursos premium. A solicitação de contestação (chargeback) é indevida, pois houve consumo do serviço prestado, o qual é digital, instantâneo e entregue imediatamente após a aprovação do pagamento. Solicitamos, portanto, o indeferimento da contestação."
             </div>
          </div>
        )
    },
    {
        id: 'cookies',
        title: 'Política de Cookies',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">1. Introdução</h4>
             <p>A Caloriz.ai utiliza cookies para melhorar a experiência do usuário, garantir segurança e personalizar conteúdos.</p>
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">2. Tipos de Cookies Utilizados</h4>
             <p>Essenciais: login, autenticação, segurança. Funcionais: salvar preferências e configurações. Analíticos: medir desempenho e comportamento. Marketing (se ativados futuramente): personalização de campanhas.</p>
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">3. Consentimento</h4>
             <p>Ao utilizar a plataforma, o usuário aceita o uso de cookies conforme descrito.</p>
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">4. Desativação</h4>
             <p>A desativação de cookies essenciais pode impedir o funcionamento da plataforma.</p>
          </div>
        )
    },
    {
        id: 'ai',
        title: 'Termos de Licença de IA',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">1. Uso da IA</h4>
             <p>O usuário entende que: A IA fornece estimativas aproximadas; Os resultados podem conter margens de erro; A IA não substitui avaliadores profissionais.</p>
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">2. Limitações da Tecnologia</h4>
             <p>A IA não identifica alergias, patologias ou riscos de saúde.</p>
             <h4 className="font-bold dark:text-zinc-200 text-gray-800">3. Propriedade Intelectual</h4>
             <p>Todo algoritmo, modelo e mecanismo da Caloriz.ai é de propriedade exclusiva da empresa.</p>
          </div>
        )
    },
    {
        id: 'resp',
        title: 'Responsabilidade Nutricional',
        content: (
          <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
             <p>A Caloriz.ai não substitui nutricionistas. A plataforma fornece estimativas baseadas em imagem, podendo apresentar divergências dependendo do: tipo de alimento, quantidade, iluminação, posição do prato, processamento da imagem. Toda decisão alimentar deve ser acompanhada por profissional da área.</p>
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
                onClick={() => navigate(-1)} 
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