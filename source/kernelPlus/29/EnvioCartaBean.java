
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
 * Classe que implementa a execu��o do servi�o de Envio de Cartas do Agente
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
	 * Servi�o de Envio de E-Mails (Correspond�ncia/Resposta R�pida)
	 * 
	 * O servi�o varre as mensagens de todas as empresas e envia as mensagens utilizando as configura��es de cada uma
	 * 
	 * Reestruturado para melhora de performance e tempo de execu��o utilizando o servi�o de notifica��o
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
					 * Varre as mensagens e carrega a configura��o por empresa
					 */
					cnccVo = envioPendente.get(i);
					config = getConfiguracoes(cnccVo.getIdEmpresa());
					
					if(cnccVo.getCorrDsEmailDe()==null || cnccVo.getCorrDsEmailDe().length()==0) throw new AbstractServicoException("Endere�o do remetente(De) vazio. O e-mail n�o pode ser enviado.");
					if(cnccVo.getCorrDsEmailPara()==null || cnccVo.getCorrDsEmailPara().length()==0) throw new AbstractServicoException("Endere�o de destino(Para) vazio. O e-mail n�o pode ser enviado.");
					
					/**
					 * Verifica se a mensagem � uma resposta de Classificador, se for utiliza as configura��es do Classificador para enviar a mensagem
					 * trecho alterado, como a query de pendente ja traz se a corr esta na RECO n�o precisa desta
					 */
					/*cnrrList = recoDao.fincCsNgtbRespostacorrRecoByIdCorr(cnccVo.getIdCorrCdCorrespondenci());
					if(cnrrList!=null && cnrrList.size()>0) {*/
					if(!cnccVo.getCsCdtbCaixaPostalCapoVo().getCapoDsServidorEnv().equalsIgnoreCase("")){
						
						/**
						 * Obt�m as configura��es do Classificador e reconfigura o envio
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
						 * Se o cliente estiver marcado como n�o contactar, a mensagem n�o deve ser enviada
						 */
						if("B".equals(cnccVo.getCorrInEnviaEmail())) throw new AbstractServicoException("Cliente marcado como n�o contactar (E-Mail).");
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
					 * Essa exce��o indica uma falha grave na execu��o dos envios, nesse caso, a execu��o � interrompida e a mensagem n�o ser� marcada com erro
					 * Pois seria um erro "geral" de envio das mensagens mas tamb�m deve ser notificado por e-mail
					 */
					erroEnvio = false;
					throw e;
					
				} catch (Throwable e) {
					String msgerro = "Mensagem n�o enviada. " + e.getMessage();
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
					 * Se deu erro e o cliente n�o est� bloqueado, marca como F para entrar na lista de e-mails com Falha
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
	 * M�todos e Atributos com Defini��es espec�ficas para a Execu��o do Envio de Cartas
	 */
	
	/**
	 * M�todo que obt�m as configura��es de envio por empresa
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
	 * M�todo que obt�m a Lista de Campos Especiais por empresa
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
				throw new AbstractServicoException("N�o foi poss�vel obter a lista de Campos Especiais.", e);
			}
		}
		
		return _caesList;
	}

	/**
	 * M�todo que obt�m a lista de Mensangens que deve ser enviada
	 * 
	 * @return
	 * @throws AbstractServicoException
	 */
	protected List findEnvioPendenteEmail(CsNgtbCorrespondenciCorrDao cnccDao) throws AbstractServicoException {
		List envioPendente = null;
		try {
			envioPendente = cnccDao.findEnvioPendenteEmail();
		} catch(Exception e) {
			throw new AbstractServicoException("N�o foi poss�vel obter a lista de mensagens a serem enviadas.", e);
		}
		
		return envioPendente;
	}
	
	/**
	 * Busca a lista de anexos do documento padr�o e retorna uma lista de MailAttachment
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
			throw new AbstractServicoException("N�o foi poss�vel carregar os anexos do documento. ("+idDocuCdDocumento+")", e);
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
	 * Busca a lista de anexos da correspond�ncia e retorna uma lista de MailAttachment
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
			throw new AbstractServicoException("N�o foi poss�vel carregar os anexos da Correspond�ncia. ("+idCorrCdCorrespondenci+") - " + e.getMessage(), e);
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
	 * M�todo que transoforma o CsNgtbCorrespondenciCorrVo em um MailMessage para efetuar o envio.
	 * 
	 * @see AbstractMailSender
	 * @see MailMessage
	 * @see CsNgtbCorrespondenciCorrVo
	 * @see Config
	 * 
	 * @param cnccVo CsNgtbCorrespondenciCorrVo com as informa��es do e-mail a ser enviado
	 * @param config Config com as configura��es de envio
	 * 
	 * @throws AbstractServicoException caso o envio n�o seja executado corretamente
	 */
	protected void enviarEmail(CsNgtbCorrespondenciCorrVo cnccVo, Config config) throws AbstractServicoException {
		MailMessage message = new MailMessage();
		
		/**
		 * Inclui o remetente e destinat�rios, se der erro em qualquer um deles, a mensagem n�o deve ser enviada
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
			 * Chamado 75860 - Vinicius - Inclus�o do campo Cco
			 */
			message.addCco(MailMessageHelper.parseRecipientsFromString(cnccVo.getCorrDsEmailCCO()));
			
			Log.log(this.getClass(), Log.DEBUGPLUS, "Cco: " + cnccVo.getCorrDsEmailCCO());
			
		} catch (MailException e) {
			throw new AbstractServicoException(e);
		}
		
		/**
		 * Assunto (n�o deve ser vazio)
		 */
		message.setSubject(cnccVo.getCorrDsTitulo());
		Log.log(this.getClass(), Log.DEBUGPLUS, "Assunto: " + cnccVo.getCorrDsTitulo());
		
		/**
		 * Se a mensagem for referente a um documento, deve incluir os anexos
		 */
		//Como os anexos sempre s�o incluidos na ANCO n�o precisa desta query
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
		 * Busca a instance de MailSender atrav�s da Configura��o
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