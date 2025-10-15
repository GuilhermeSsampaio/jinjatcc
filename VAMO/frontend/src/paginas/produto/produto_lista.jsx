import React, { useEffect, useRef, useState, useContext } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import ContextoUsuario from "../../contextos/contexto_usuario";
import {
  servicoListarProduto,
  servicoRemoverProduto,
} from "../../servicos/servicos_produto";
import {
  estilizarBotao,
  estilizarBotaoRemover,
  estilizarBotaoTabela,
  estilizarCard,
  estilizarColumnHeader,
  estilizarDataTable,
  estilizarDivBotoesAcao,
  estilizarFooterDialog,
  TAMANHOS,
  TEMA_PADRAO,
} from "../../utilitarios/estilos";
import mostrarToast from "../../utilitarios/mostrar_toast";

export default function PaginaProdutoLista() {
  const navigate = useNavigate();
  const toastRef = useRef(null);
  const { usuarioLogado } = useContext(ContextoUsuario);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [mostrarDialogConfirmacao, setMostrarDialogConfirmacao] = useState(false);
  const corTema = usuarioLogado?.cor_tema || TEMA_PADRAO;

  useEffect(() => {
    async function carregarItens() {
      try {
        setLoading(true);
        const resposta = await servicoListarProduto();
        setItens(Array.isArray(resposta) ? resposta : (resposta?.data || []));
      } catch (erro) {
        mostrarToast(toastRef, "Erro ao carregar produtos", "erro");
      } finally {
        setLoading(false);
      }
    }
    carregarItens();
  }, []);

  function handleAbrirModalRemocao(item) {
    setItemSelecionado(item);
    setMostrarDialogConfirmacao(true);
  }

  async function handleRemoverConfirmado() {
    try {
      await servicoRemoverProduto(itemSelecionado.id);
      setItens((lista) => lista.filter((item) => item.id !== itemSelecionado.id));
      mostrarToast(toastRef, "Item removido com sucesso", "sucesso");
    } catch (erro) {
      mostrarToast(toastRef, "Erro ao remover item", "erro");
    } finally {
      setMostrarDialogConfirmacao(false);
      setItemSelecionado(null);
    }
  }

  function colunaAcoesTemplate(rowData) {
    return (
      <div className={estilizarDivBotoesAcao()}>
        <Button
          icon="pi pi-pencil"
          className={estilizarBotaoTabela(corTema)}
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}          onClick={() => navigate(`/produtos/${rowData.id}/editar`)}
        />
        <Button
          icon="pi pi-trash"
          className={estilizarBotaoTabela(corTema, true)}
          tooltip="Remover"
          tooltipOptions={{ position: "top" }}          onClick={() => handleAbrirModalRemocao(rowData)}
        />
      </div>
    );
  }

  const footerDialog = (
    <div className={estilizarFooterDialog()}>
      <Button
        label="Cancelar"
        onClick={() => setMostrarDialogConfirmacao(false)}
        className={estilizarBotao(corTema)}
      />
      <Button
        label="Remover"
        onClick={handleRemoverConfirmado}
        className={estilizarBotaoRemover(corTema)}
      />
    </div>
  );

  return (
    <div className="p-4">
      <Toast ref={toastRef} position="bottom-center" />

      <div className="flex justify-content-end mb-3">
        <Button
          label="Novo"
          icon="pi pi-plus"
          className={estilizarBotao(corTema)}
          onClick={() => navigate("/produtos/novo")}
        />
      </div>

      <DataTable
        value={itens}
        loading={loading}
        paginator
        rows={TAMANHOS.MAX_LINHAS_TABELA}
        emptyMessage="Nenhum item encontrado"
        responsiveLayout="stack"
        className={estilizarDataTable()}
      >
        <Column 
          field="id" 
          header="ID" 
          sortable 
          headerClassName={estilizarColumnHeader(corTema)}
        />
        <Column 
          field="nome" 
          header="Nome" 
          sortable 
          headerClassName={estilizarColumnHeader(corTema)}
        />
        <Column 
          header="Acoes" 
          body={colunaAcoesTemplate}
          headerClassName={estilizarColumnHeader(corTema)}
        />
      </DataTable>

      <Dialog
        visible={mostrarDialogConfirmacao}
        onHide={() => setMostrarDialogConfirmacao(false)}
        header="Confirmar Remocao"
        footer={footerDialog}
        style={{ width: "350px" }}      >
        <div className="flex align-items-center">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
          <span>Confirma a remocao do item selecionado?</span>
        </div>
      </Dialog>
    </div>
  );
}