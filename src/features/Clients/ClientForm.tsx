import { Box, Typography, Button, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import FTextField from "../../components/FTextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { createClient, createMultipleEntities, fetchClientById, updateClient, fetchEntitiesByClientId, deleteEntitiesByClientId } from "../../services/supabaseService";
import SimpleTable from "../../components/SimpleTable";
import FButton from "../../components/FButton/FButton";
import LoadingFade from "../../components/LoadingFade";

interface RelatedEntity {
  id: string;
  name: string;
  keyword: string;
  type: string;
}

const ClientForm = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [clientName, setClientName] = useState("");
  const [ein, setEin] = useState("");
  const [industry, setIndustry] = useState("");
  const [relatedEntities, setRelatedEntities] = useState<RelatedEntity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar datos del cliente si estamos editando
  useEffect(() => {
    if (isEditing && id) {
      const loadClient = async () => {
        setLoading(true);
        try {
          const client = await fetchClientById(parseInt(id));
          if (client) {
            setClientName(client.name);
            setEin(client.ein);
            setIndustry(client.industry);
            
            // Cargar las entities del cliente
            const entities = await fetchEntitiesByClientId(client.id);
            console.log('Entities loaded for client:', client.id, entities);
            
            // Convertir las entities de Supabase al formato local
            const localEntities: RelatedEntity[] = entities.map(entity => ({
              id: entity.id.toString(),
              name: entity.name,
              keyword: entity.keywords.join(', '), // Convertir array a string
              type: entity.type,
            }));
            
            setRelatedEntities(localEntities);
          }
        } catch (error) {
          console.error('Error loading client:', error);
          alert(t("clients.loadError"));
        } finally {
          setLoading(false);
        }
      };
      
      loadClient();
    }
  }, [isEditing, id, t]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!clientName || !ein) {
      alert(t("clients.validationError"));
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditing && id) {
        // Actualizar cliente existente
        await updateClient(parseInt(id), {
          name: clientName,
          ein: ein,
          industry: industry,
        });
        console.log("Cliente actualizado exitosamente");

        // Eliminar todas las entities existentes del cliente
        await deleteEntitiesByClientId(parseInt(id));
        console.log("Entities existentes eliminadas");

        // Crear las nuevas entities si hay alguna
        if (relatedEntities.length > 0) {
          const entitiesToCreate = relatedEntities.map(entity => ({
            name: entity.name,
            keywords: entity.keyword.split(',').map(k => k.trim()), // Convertir string a array
            type: entity.type,
            client_id: parseInt(id),
          }));

          const createdEntities = await createMultipleEntities(entitiesToCreate);
          console.log("Nuevas entities creadas:", createdEntities);
        }
      } else {
        // Crear nuevo cliente
        const newClient = await createClient({
          name: clientName,
          ein: ein,
          industry: industry,
        });

        console.log("Cliente creado:", newClient);

        // Crear las entities si hay alguna
        if (relatedEntities.length > 0) {
          const entitiesToCreate = relatedEntities.map(entity => ({
            name: entity.name,
            keywords: entity.keyword.split(',').map(k => k.trim()), // Convertir string a array
            type: entity.type,
            client_id: newClient.id,
          }));

          const createdEntities = await createMultipleEntities(entitiesToCreate);
          console.log("Entities creadas:", createdEntities);
        }
      }

      // Navegar de vuelta a la lista
      navigate('/clients');
      
    } catch (error) {
      console.error('Error guardando cliente:', error);
      alert(t("clients.saveError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEntity = useCallback(() => {
    const newEntity: RelatedEntity = {
      id: Date.now().toString(),
      name: "",
      keyword: "",
      type: "",
    };
    setRelatedEntities(prev => [...prev, newEntity]);
  }, []);

  const updateEntity = useCallback((id: string, field: keyof RelatedEntity, value: string) => {
    console.log('updateEntity called:', id, field, value);
    setRelatedEntities(prev =>
      prev.map(entity =>
        entity.id === id ? { ...entity, [field]: value } : entity
      )
    );
  }, []);

  const deleteEntity = useCallback((id: string) => {
    setRelatedEntities(prev => prev.filter(entity => entity.id !== id));
  }, []);

  // Definir las columnas para SimpleTable de Related Entities
  const entityColumns: ColumnDef<RelatedEntity>[] = useMemo(() => [
    {
      accessorKey: "name",
      header: t("clients.entityName").toUpperCase(),
      cell: ({ row }) => (
        <FTextField
          label=""
          value={row.getValue("name")}
          onChange={(value) => updateEntity(row.original.id, "name", value)}
          hideLabel
        />
      ),
      size: 300,
    },
    {
      accessorKey: "keyword",
      header: t("clients.entityKeyword").toUpperCase(),
      cell: ({ row }) => {
        const keywordValue = row.getValue("keyword") as string;
        const keywords = keywordValue ? keywordValue.split(',').map((k: string) => k.trim()).filter((k: string) => k) : [];
        
        return (
          <FTextField
            label=""
            value=""
            enableChips={true}
            chips={keywords}
            onChipsChange={(newChips) => {
              const keywordsString = newChips.join(', ');
              updateEntity(row.original.id, "keyword", keywordsString);
            }}
            placeholder="clients.keywordPlaceholder"
            hideLabel
          />
        );
      },
      size: 400,
    },
    {
      accessorKey: "type",
      header: t("clients.entityType").toUpperCase(),
      cell: ({ row }) => (
        <FTextField
          label=""
          value={row.getValue("type")}
          onChange={(value) => updateEntity(row.original.id, "type", value)}
          hideLabel
        />
      ),
      size: 200,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => deleteEntity(row.original.id)}
            size="small"
            sx={{ 
              color: "#d32f2f",
              minWidth: "auto",
              padding: "4px 8px",
              "&:hover": {
                backgroundColor: "rgba(211, 47, 47, 0.1)",
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Box>
      ),
      size: 100,
    },
  ], [t, updateEntity, deleteEntity]);

  return (
    <LoadingFade loading={loading}>
      <Box sx={{ backgroundColor: "white", minHeight: "50vh", padding: 24, borderRadius: theme.shape.borderRadius }}>
        <Typography component="h1" sx={{ fontSize: 24, fontWeight: 700, mb: 20 }}>
          {isEditing ? t("clients.editTitle") : t("clients.registerTitle")}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <FTextField
              sx={{ width: "70%" }}
              label="clients.clientName"
              placeholder="clients.clientNamePlaceholder"
              value={clientName}
              onChange={setClientName}
              required
            />
            
            <Box sx={{ display: "flex", gap: 40 }}>
              <FTextField
                label="clients.ein"
                placeholder="clients.einPlaceholder"
                value={ein}
                onChange={setEin}
                required
              />
              
              <FTextField
                label="clients.industry"
                placeholder="clients.industryPlaceholder"
                value={industry}
                onChange={setIndustry}
              />
            </Box>
          </Box>

          {/* Related Entities Section */}
          <Box sx={{ mb: 20, mt: 20 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 20 }}>
              <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>
                {t("clients.relatedEntities")}
              </Typography>
              <Button
                onClick={addEntity}
                startIcon={<AddIcon />}
                sx={{
                  color: "primary.main",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                {t("clients.addEntity")}
              </Button>
            </Box>
            
            <SimpleTable
              data={relatedEntities}
              columns={entityColumns}
              editable={false}
              searchable={false}
              sortable={false}
              pagination={false}
              disableFilter={true}
              disableSearch={true}
              t={t}
            />
          </Box>
          
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 20 }}>
            <FButton
              onClick={() => navigate('/clients')}
              variant="outlined"
              color="secondary"
              disabled={isSubmitting}
              title={t("clients.cancel")}
            />
            <FButton
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              title={isSubmitting ? t("clients.saving") : (isEditing ? t("clients.updateButton") : t("clients.registerButton"))}
            />
          </Box>
        </Box>
      </Box>
    </LoadingFade>
  );
};

export default ClientForm; 