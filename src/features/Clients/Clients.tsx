import { Box, Typography, Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import SimpleTable from "../../components/SimpleTable";
import LoadingFade from "../../components/LoadingFade";
import { useClients } from "../../hooks/useClients";
import { Client } from "../../types/supabaseTypes";
import { deleteClient } from "../../services/supabaseService";
import ConfirmDialog from "../../components/ConfirmDialog";
import FButton from "../../components/FButton/FButton";

const Clients = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { clients, loading, error, refreshClients } = useClients();

  // Estados para el modal de confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const handleAddClient = () => {
    navigate("/clients/new");
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/clients/edit/${clientId}`);
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;

    setDeleting(true);
    try {
      await deleteClient(clientToDelete.id);
      // Recargar la lista de clientes
      refreshClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      alert(t("clients.deleteError"));
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setClientToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmOpen(false);
    setClientToDelete(null);
  };

  // Definir las columnas para SimpleTable
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "name",
      header: t("clients.clientName").toUpperCase(),
      cell: ({ row }) => row.getValue("name"),
      size: 500,
    },
    {
      accessorKey: "ein",
      header: t("clients.ein").toUpperCase(),
      cell: ({ row }) => row.getValue("ein"),
      size: 300,
    },
    {
      accessorKey: "industry",
      header: t("clients.industry").toUpperCase(),
      cell: ({ row }) => row.getValue("industry"),
      size: 300,
    },
    {
      id: "actions",
      header: t("clients.actions").toUpperCase(),
      cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
          <Button
            onClick={() => handleEditClient(row.original.id.toString())}
            size="small"
            sx={{
              color: "primary.main",
              minWidth: "auto",
              padding: "4px 8px",
            }}
          >
            <EditIcon fontSize="small" />
          </Button>
          <Button
            onClick={() => handleDeleteClick(row.original)}
            size="small"
            sx={{
              color: "#d32f2f",
              minWidth: "auto",
              padding: "4px 8px",
            }}
          >
            <DeleteIcon
              fontSize="small"
              sx={{ color: theme.palette.primary.main }}
            />
          </Button>
        </Box>
      ),
    },
  ];

  if (error) {
    return (
      <Box sx={{ backgroundColor: "white", minHeight: "50vh", padding: 24 }}>
        <Typography sx={{ fontSize: 16, color: "#d32f2f" }}>
          {t("clients.error")}: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <LoadingFade loading={loading}>
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: theme.shape.borderRadius,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Typography
            component="h4"
            sx={{
              fontWeight: 600,
              color: "#333",
              fontSize: "1.5rem",
              margin: 0,
              marginBottom: "8px",
              marginRight: 3,
            }}
          >
            {t("clients.title")}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 16 }}>
            <FButton 
              onClick={handleAddClient} 
              title={t("clients.addClient")}
              sx={{ height: 40 }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: theme.shape.borderRadius,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <SimpleTable
            data={clients}
            columns={columns}
            editable={false}
            searchable={true}
            sortable={true}
            pagination={true}
            disableFilter={true}
          />
        </Box>
      </LoadingFade>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDialog
        open={confirmOpen}
        title={t("clients.deleteConfirmTitle")}
        description={
          clientToDelete
            ? t("clients.deleteConfirmMessage", { name: clientToDelete.name })
            : t("clients.deleteConfirmMessage")
        }
        confirmText={t("clients.delete")}
        cancelText={t("clients.cancel")}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
};

export default Clients;
