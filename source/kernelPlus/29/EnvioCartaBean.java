
package br.com.plusoft.csi.gerente.ejb.servico;

import java.util.Iterator;
import java.util.List;
import java.util.Vector;

import br.com.plusoft.csi.adm.dao.CsCatbDocumentoAnexoDoanDao;
import br.com.plusoft.csi.adm.dao.CsCdtbCampoEspecialCaesDao;
import br.com.plusoft.csi.adm.helper.ConfiguracaoConst;
import br.com.plusoft.csi.adm.helper.MAConstantes;
import br.com.plusoft.csi.adm.util.ConfiguracoesImpl;
import br.com.plusoft.csi.adm.vo.CsCatbDocumentoAnexoDoanVo;
import br.com.plusoft.csi.adm.vo.CsCdtbCampoEspecialCaesVo;
import br.com.plusoft.csi.adm.vo.ParametrosCaixaPostalVo;
import br.com.plusoft.csi.crm.dao.CsCdtbAnexocorrespAncoDao;
import br.com.plusoft.csi.crm.dao.CsNgtbCorrespondenciCorrDao;
import br.com.plusoft.csi.crm.dao.CsNgtbRespostacorrRecoDao;
import br.com.plusoft.csi.crm.vo.CsCdtbAnexocorrespAncoVo;
import br.com.plusoft.csi.crm.vo.CsNgtbCorrespondenciCorrVo;
import br.com.plusoft.csi.crm.vo.CsNgtbRespostacorrRecoVo;
import br.com.plusoft.csi.gerente.dao.generic.ImpressaoCartaDao;
import br.com.plusoft.fw.exception.AbstractServicoException;
import br.com.plusoft.fw.exception.AbstractServicoFailure;
import br.com.plusoft.fw.exception.ServicoCancelado;
import br.com.plusoft.fw.log.Log;
import br.com.plusoft.fw.mail.MailAttachment;
import br.com.plusoft.fw.mail.MailException;
import br.com.plusoft.fw.mail.MailMessage;
import br.com.plusoft.fw.mail.MailMessageHelper;
import br.com.plusoft.fw.mail.MessageException;
import br.com.plusoft.fw.mailsender.AbstractMailSender;
import br.com.plusoft.fw.mailsender.Config;

/**
 * Classe que implementa a execução do serviço de Envio de Cartas do Agente
 *  
 * @author jvarandas
 * @since 07/06/2011 
 * @see AbstractServicoBean
 *
 */
public class EnvioCartaBean extends AbstractServicoBean {

	/**
	 * javax.ejb.SessionBean
	 */
	public void ejbCreate() throws javax.ejb.CreateException {}
	
	public void ejbActivate() {}
	
	public void ejbPassivate() {}
	
	public void ejbRemove() {}

	/**
	 * Serviço de Envio de E-Mails (Correspondência/Resposta Rápida)
	 * 
	 * O serviço varre as mensagens de todas as empresas e envia as mensagens utilizando as configurações de cada uma
	 * 
	 * Reestruturado para melhora de performance e tempo de execução utilizando o serviço de notificação
	 * @author jvarandas
	 * @since 06/06/2011
	 * 
	 */
	public void iniciaServicoSpec(long idEmprCdEmpresa) throws AbstractServicoException {
		CsNgtbCorrespondenciCorrDao cnccDao = null;
		CsNgtbCorrespondenciCorrVo cnccVo = null;
		CsNgtbRespostacorrRecoDao recoDao = null;
		List<CsNgtbCorrespondenciCorrVo> envioPendente = null;
		List<CsNgtbRespostacorrRecoVo> cnrrList = null;
		ParametrosCaixaPostalVo paramVo = null;
		ImpressaoCartaDao cartaDao = null;
		
		Config config = null;
		boolean erroEnvio = false;
		
		Log.log(this.getClass(), Log.DEBUGPLUS, "Inicio");
		
		try {
			this.config = null;
			cnccDao = new CsNgtbCorrespondenciCorrDao(idEmprCdEmpresa);
			recoDao = new CsNgtbRespostacorrRecoDao();
			cartaDao = ImpressaoCartaDao.getInstance(idEmprCdEmpresa);
			
			/**
			 * Busca as mensagens pendentes para envio
			 */
			envioPendente = this.findEnvioPendenteEmail(cnccDao);
			Log.log(this.getClass(), Log.INFOPLUS, envioPendente.size() + " mensagens pendentes.");
			
			for(int i=0; i < envioPendente.size(); i++) {
				
				if(this.servicoCancelado) throw new ServicoCancelado();
				
				Log.log(this.getClass(), Log.INFOPLUS, "enviando mensagem " + String.valueOf(i+1) + " de " + String.valueOf(envioPendente.size()));
				
				try {
					erroEnvio = false;
					/**
					 * Varre as mensagens e carrega a configuração por empresa
					 */
					cnccVo = envioPendente.get(i);
					config = getConfiguracoes(cnccVo.getIdEmpresa());
					
					if(cnccVo.getCorrDsEmailDe()==null || cnccVo.getCorrDsEmailDe().length()==0) throw new AbstractServicoException("Endereço do remetente(De) vazio. O e-mail não pode ser enviado.");
					if(cnccVo.getCorrDsEmailPara()==null || cnccVo.getCorrDsEmailPara().length()==0) throw new AbstractServicoException("Endereço de destino(Para) vazio. O e-mail não pode ser enviado.");
					
					/**
					 * Verifica se a mensagem é uma resposta de Classificador, se for utiliza as configurações do Classificador para enviar a mensagem
					 * trecho alterado, como a query de pendente ja traz se a corr esta na RECO não precisa desta
					 */
					/*cnrrList = recoDao.fincCsNgtbRespostacorrRecoByIdCorr(cnccVo.getIdCorrCdCorrespondenci());
					if(cnrrList!=null && cnrrList.size()>0) {*/
					if(!cnccVo.getCsCdtbCaixaPostalCapoVo().getCapoDsServidorEnv().equalsIgnoreCase("")){
						
						/**
						 * Obtém as configurações do Classificador e reconfigura o envio
						 */
						//paramVo = new ParametrosCaixaPostalVo();
						//cnrrList.get(0).getCsNgtbManifTempMatmVo().getCsCdtbCaixaPostalCapoVo().populaParametros(paramVo);
						
						//config.host=paramVo.getFieldAsString("mail.smtp.host");
						//config.pool=paramVo.getFieldAsString("pool");
						
						config.pool=cnccVo.getCsCdtbCaixaPostalCapoVo().getCapoDsPoolEnv();
						
						config.host=cnccVo.getCsCdtbCaixaPostalCapoVo().getCapoDsServidorEnv();
						config.debug=cnccVo.getCsCdtbCaixaPostalCapoVo().isCapoInDebugEnv();
						config.user=cnccVo.getCsCdtbCaixaPostalCapoVo().getCapoDsUsuarioEnv();
						config.password=cnccVo.getCsCdtbCaixaPostalCapoVo().getCapoDsSenhaEnv();
						
						try {
							//config.port = Integer.parseInt(paramVo.getFieldAsString("mail.smtp.port"));
							config.port = Integer.parseInt(cnccVo.getCsCdtbCaixaPostalCapoVo().getCapoDsPortaEnv());
						} catch(Exception e) {}
						
						cnccVo.setCorrDsEmailDe(cnccVo.getCsCdtbCaixaPostalCapoVo().getCapoDsEmailresposta());
						//paramVo = null;
						
					} else {
						/**
						 * Se o cliente estiver marcado como não contactar, a mensagem não deve ser enviada
						 */
						if("B".equals(cnccVo.getCorrInEnviaEmail())) throw new AbstractServicoException("Cliente marcado como não contactar (E-Mail).");
					}
					
					/**
					 * Carrega a lista de Campos Especiais e faz o Replace no texto do documento
					 */
					String textoDocumento = cartaDao.getConteudoCampoEspecial(cnccVo, findCsCdtbCampoEspecialCaes(cnccVo.getIdEmpresa()));
					cnccVo.setCorrTxCorrespondencia(textoDocumento);

					/**
					 * Efetua o Envio
					 */
					enviarEmail(cnccVo, config);
					
					cnccVo.setCorrDsErroenvio(null);
					
					/**
					 * Se enviou a mensagem normalmente marca o envio
					 */
					cnccDao.store(cnccVo.getIdCorrCdCorrespondenci(), cnccVo.getCorrTxCorrespondencia(), "T", true);	
				} catch (AbstractServicoFailure e) {
					/**
					 * Essa exceção indica uma falha grave na execução dos envios, nesse caso, a execução é interrompida e a mensagem não será marcada com erro
					 * Pois seria um erro "geral" de envio das mensagens mas também deve ser notificado por e-mail
					 */
					erroEnvio = false;
					throw e;
					
				} catch (Throwable e) {
					String msgerro = "Mensagem não enviada. " + e.getMessage();
					if(cnccVo!=null) {
						msgerro = msgerro.concat("(idCorrCdCorrespondenci="+cnccVo.getIdCorrCdCorrespondenci()+", "+
								"corrDsTitulo='"+cnccVo.getCorrDsTitulo()+"', "+
								"corrDsEmailDe='"+cnccVo.getCorrDsEmailDe()+"'"+
								")");
						
						cnccVo.setCorrDsErroenvio(e.getMessage());
					}
					
					this.addDetalheErro(msgerro, e);
					erroEnvio = true;
				
					Log.log(this.getClass(), Log.ERRORPLUS, msgerro, e);
				} finally {
					/**
					 * Se deu erro e o cliente não está bloqueado, marca como F para entrar na lista de e-mails com Falha
					 * E-mails bloqueados devem ficar marcados como B-Bloqueado
					 */
					if(erroEnvio && cnccVo!=null) {
						if(!"B".equals(cnccVo.getCorrInEnviaEmail())) cnccVo.setCorrInEnviaEmail("F");
						cnccDao.storeEmailNaoEnviado(cnccVo.getIdCorrCdCorrespondenci(), cnccVo.getCorrInEnviaEmail(), cnccVo.getCorrDsErroenvio());
					} 
					
					cnccVo = null;
				}
			}
			
		} catch (AbstractServicoException e) {
			throw e;
		} catch (Exception e) {
			throw new AbstractServicoException(e);
		} finally {
			cnccDao = null;
			cnccDao = null;
			config = null;
		}
	}
	

	/**
	 * Métodos e Atributos com Definições específicas para a Execução do Envio de Cartas
	 */
	
	/**
	 * Método que obtém as configurações de envio por empresa
	 */
	private Config config=null;
	protected Config getConfiguracoes(long idEmprCdEmpresa) {
		if(config==null || idEmprCdEmpresa!=config.empresa) {
			config = new Config(idEmprCdEmpresa);
			
			try {
				config.port = Integer.parseInt(ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_PORT, idEmprCdEmpresa));
			} catch(Exception e) {}
			
			config.host = ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_HOST, idEmprCdEmpresa);
			config.pool = ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_POOL, idEmprCdEmpresa);
			config.user = ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_POOL_USER, idEmprCdEmpresa);
			config.password = ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_POOL_PASSWORD, idEmprCdEmpresa);
			config.auth = ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_AUTH, idEmprCdEmpresa).equalsIgnoreCase("S");
			
			Log.log(this.getClass(), Log.INFOPLUS, "CONFIG ENVIO DE CARTA: ");
			Log.log(this.getClass(), Log.INFOPLUS, "HOST: " + ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_HOST, idEmprCdEmpresa));
			Log.log(this.getClass(), Log.INFOPLUS, "POOL: " + ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_POOL, idEmprCdEmpresa));
			Log.log(this.getClass(), Log.INFOPLUS, "USER: " + ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_POOL_USER, idEmprCdEmpresa));
			Log.log(this.getClass(), Log.INFOPLUS, "PASS: " + ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_POOL_PASSWORD, idEmprCdEmpresa));
			Log.log(this.getClass(), Log.INFOPLUS, "AUTH: " + ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_AUTH, idEmprCdEmpresa));
			
		} 
	
		try {
			config.debug = ConfiguracoesImpl.obterConfiguracao(ConfiguracaoConst.CONF_ENVIO_EMAIL_DEBUG, idEmprCdEmpresa).equalsIgnoreCase("S")?true:false;
		} catch(Exception e) {}
		
		return new Config(config);
	}
	
	Vector<CsCdtbCampoEspecialCaesVo> _caesList = null;
	
	/**
	 * Método que obtém a Lista de Campos Especiais por empresa
	 * 
	 * @return
	 * @throws AbstractServicoException 
	 */
	protected Vector findCsCdtbCampoEspecialCaes(long idEmprCdEmpresa) throws AbstractServicoException {
		if(_caesList==null) {
			CsCdtbCampoEspecialCaesDao ccceaDao = new CsCdtbCampoEspecialCaesDao();
			try {
				_caesList = ccceaDao.findAllCsCdtbCampoEspecialCaesByEmpresa("K", MAConstantes.ID_EMPRESA_PADRAO);
			} catch (Exception e) {
				throw new AbstractServicoException("Não foi possível obter a lista de Campos Especiais.", e);
			}
		}
		
		return _caesList;
	}

	/**
	 * Método que obtém a lista de Mensangens que deve ser enviada
	 * 
	 * @return
	 * @throws AbstractServicoException
	 */
	protected List findEnvioPendenteEmail(CsNgtbCorrespondenciCorrDao cnccDao) throws AbstractServicoException {
		List envioPendente = null;
		try {
			envioPendente = cnccDao.findEnvioPendenteEmail();
		} catch(Exception e) {
			throw new AbstractServicoException("Não foi possível obter a lista de mensagens a serem enviadas.", e);
		}
		
		return envioPendente;
	}
	
	/**
	 * Busca a lista de anexos do documento padrão e retorna uma lista de MailAttachment
	 *  
	 * @param idCorrCdCorrespondenci
	 * @return
	 * @throws AbstractServicoException
	 */
	protected List<MailAttachment> findAnexosCsCdtbDocumentoanexoDoan(long idDocuCdDocumento) throws AbstractServicoException {
		List<MailAttachment> l = new Vector<MailAttachment>();
		if(idDocuCdDocumento==0) return l;
		
		CsCatbDocumentoAnexoDoanDao ccdaDao = new CsCatbDocumentoAnexoDoanDao(this.idEmprCdEmpresa);
		List<CsCatbDocumentoAnexoDoanVo> ccdaList = null;
		try {
			ccdaList = ccdaDao.findCsCatbDocumentoAnexoDoanByIdDocu(idDocuCdDocumento, this.idIdioCdIdioma);	
		} catch (Exception e) {
			throw new AbstractServicoException("Não foi possível carregar os anexos do documento. ("+idDocuCdDocumento+")", e);
		}
		
		if(ccdaList!=null & ccdaList.size()>0) {
			for (Iterator<CsCatbDocumentoAnexoDoanVo> iterator = ccdaList.iterator(); iterator.hasNext();) {
				CsCatbDocumentoAnexoDoanVo ccdaVo = iterator.next();
				
				//Chamados: 81291 e 82253
				if(ccdaVo.getCsCdtbAnexoMailAnmaVo().getAnmaBlAnexoBytes() != null && ccdaVo.getCsCdtbAnexoMailAnmaVo().getAnmaBlAnexoBytes().length > 0)
				{
					l.add(new MailAttachment(ccdaVo.getCsCdtbAnexoMailAnmaVo().getAnmaDsArquivoAnexo(), ccdaVo.getCsCdtbAnexoMailAnmaVo().getAnmaBlAnexoBytes(), false, 0));
				}
			}
		}
		
		return l;
	}
	
	/**
	 * Busca a lista de anexos da correspondência e retorna uma lista de MailAttachment
	 *  
	 * @param idCorrCdCorrespondenci
	 * @return
	 * @throws AbstractServicoException
	 */
	protected List<MailAttachment> findAnexosCsCdtbAnexocorrAnco(long idCorrCdCorrespondenci) throws AbstractServicoException {
		List<MailAttachment> l = new Vector<MailAttachment>();
		if(idCorrCdCorrespondenci==0) return l;
		
		CsCdtbAnexocorrespAncoDao ancoDao = new CsCdtbAnexocorrespAncoDao();
		List<CsCdtbAnexocorrespAncoVo> ccaaList = null; 
		try {
			ccaaList = ancoDao.findCsCdtbAnexocorrespAncoByCorresp(idCorrCdCorrespondenci, null);
		} catch (Exception e) {
			throw new AbstractServicoException("Não foi possível carregar os anexos da Correspondência. ("+idCorrCdCorrespondenci+") - " + e.getMessage(), e);
		}
		
		if(ccaaList!=null & ccaaList.size()>0) {
			for (Iterator<CsCdtbAnexocorrespAncoVo> iterator = ccaaList.iterator(); iterator.hasNext();) {
				CsCdtbAnexocorrespAncoVo ccaaVo = iterator.next();
				
				//Chamado: 82028
				if(ccaaVo.getAncoTxAnexo() != null && ccaaVo.getAncoTxAnexo().length > 0)
				{
					l.add(new MailAttachment(ccaaVo.getAncoDsArquivo(), ccaaVo.getAncoTxAnexo(), false, ccaaVo.getAncoNrSequencia()));
				}
			}
		}

		return l;
	}
	
	
	/**
	 * Método que transoforma o CsNgtbCorrespondenciCorrVo em um MailMessage para efetuar o envio.
	 * 
	 * @see AbstractMailSender
	 * @see MailMessage
	 * @see CsNgtbCorrespondenciCorrVo
	 * @see Config
	 * 
	 * @param cnccVo CsNgtbCorrespondenciCorrVo com as informações do e-mail a ser enviado
	 * @param config Config com as configurações de envio
	 * 
	 * @throws AbstractServicoException caso o envio não seja executado corretamente
	 */
	protected void enviarEmail(CsNgtbCorrespondenciCorrVo cnccVo, Config config) throws AbstractServicoException {
		MailMessage message = new MailMessage();
		
		/**
		 * Inclui o remetente e destinatários, se der erro em qualquer um deles, a mensagem não deve ser enviada
		 */
		try {
			/**
			 * From
			 */
			message.setFrom(MailMessageHelper.parseRecipientFromString(cnccVo.getCorrDsEmailDe()));
			Log.log(this.getClass(), Log.DEBUGPLUS, "De: " + cnccVo.getCorrDsEmailDe());
			
			/**
			 * To
			 */
			message.addTo(MailMessageHelper.parseRecipientsFromString(cnccVo.getCorrDsEmailPara()));
			Log.log(this.getClass(), Log.DEBUGPLUS, "Para: " +  cnccVo.getCorrDsEmailPara());
			
			/**
			 * Cc
			 */
			message.addCc(MailMessageHelper.parseRecipientsFromString(cnccVo.getCorrDsEmailCC()));
			Log.log(this.getClass(), Log.DEBUGPLUS, "Cc: " + cnccVo.getCorrDsEmailCC());
			
			
			/**
			 * Cco
			 * Chamado 75860 - Vinicius - Inclusão do campo Cco
			 */
			message.addCco(MailMessageHelper.parseRecipientsFromString(cnccVo.getCorrDsEmailCCO()));
			
			Log.log(this.getClass(), Log.DEBUGPLUS, "Cco: " + cnccVo.getCorrDsEmailCCO());
			
		} catch (MailException e) {
			throw new AbstractServicoException(e);
		}
		
		/**
		 * Assunto (não deve ser vazio)
		 */
		message.setSubject(cnccVo.getCorrDsTitulo());
		Log.log(this.getClass(), Log.DEBUGPLUS, "Assunto: " + cnccVo.getCorrDsTitulo());
		
		/**
		 * Se a mensagem for referente a um documento, deve incluir os anexos
		 */
		//Como os anexos sempre são incluidos na ANCO não precisa desta query
		//message.addAttachments(findAnexosCsCdtbDocumentoanexoDoan(cnccVo.getCsCdtbDocumentoDocuVo().getIdDocuCdDocumento()));
		
		/**
		 * Adicionar os anexos referentes a mensagem
		 */
		message.addAttachments(findAnexosCsCdtbAnexocorrAnco(cnccVo.getIdCorrCdCorrespondenci()));
		if(message.hasAttachments()) {
			Log.log(this.getClass(), Log.DEBUGPLUS, message.getAttachments().size()+" anexos");
		} else {
			Log.log(this.getClass(), Log.DEBUGPLUS, "Sem anexos");
		}
		
		/**
		 * Define o corpo da Mensagem
		 */
		message.setHtmlBody(cnccVo.getCorrTxCorrespondencia());
		Log.log(this.getClass(), Log.DEBUGPLUS, "Body:\n"+cnccVo.getCorrTxCorrespondencia());
		
		/**
		 * Busca a instance de MailSender através da Configuração
		 */
		AbstractMailSender mailSender = AbstractMailSender.getInstance(config);
		
		
				
		/**
		 * Executa o envio da Mensagem
		 */
		try {
			Log.log(this.getClass(), Log.DEBUGPLUS, "Enviando");
			mailSender.sendMessage(message);
		} catch (MessageException e) {
			Log.log(this.getClass(), Log.DEBUGPLUS, "Erro ao enviar a mensagem." + e.getMessage(), e);
			throw new AbstractServicoException(e);
		}
	}
	
	
	
}