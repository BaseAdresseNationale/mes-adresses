import { Pane, Button, toaster } from "evergreen-ui";

import usePublishProcess from "@/hooks/publish-process";

import StatusBadge from "@/components/status-badge";
import BANSync from "@/components/sub-header/bal-status/ban-sync";
import RefreshSyncBadge from "@/components/sub-header/bal-status/refresh-sync-badge";
import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  BaseLocaleSync,
} from "@/lib/openapi-api-bal";
import { CommuneType } from "@/types/commune";

interface BALStatusProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune: CommuneType;
  token: string;
  isRefrehSyncStat: boolean;
  handlePublication: () => Promise<any>;
  handleHabilitation: () => Promise<void>;
  reloadBaseLocale: () => void;
}

function BALStatus({
  baseLocale,
  commune,
  token = null,
  isRefrehSyncStat,
  handlePublication,
  handleHabilitation,
  reloadBaseLocale,
}: BALStatusProps) {
  const { handleShowHabilitationProcess } = usePublishProcess(commune);

  const handlePause = async () => {
    try {
      await BasesLocalesService.pauseBaseLocale(baseLocale.id);
      toaster.success(
        "Mise en pause des mises à jour automatiques de la Base Adresses Nationale"
      );
    } catch (error: unknown) {
      toaster.danger(
        "Impossible de suspendre la mise à jour de la Base Adresses Nationale",
        {
          description: (error as any).body.message,
        }
      );
    }
    await reloadBaseLocale();
  };

  const handleResumeSync = async () => {
    try {
      await BasesLocalesService.resumeBaseLocale(baseLocale.id);
      toaster.success(
        "Reprise de la mise à jour automatique de la Base Adresses Nationale"
      );
    } catch (error: unknown) {
      toaster.danger(
        "Impossible de reprendre la mise à jour automatique de la Base Adresses Nationale",
        {
          description: (error as any).body.message,
        }
      );
    }
    await reloadBaseLocale();
  };

  return (
    <>
      <Pane height={28} marginRight={8} flexShrink={0}>
        {isRefrehSyncStat ? (
          <RefreshSyncBadge />
        ) : (
          <StatusBadge status={baseLocale.status} sync={baseLocale.sync} />
        )}
      </Pane>

      {token &&
        (baseLocale.sync ? (
          <BANSync
            baseLocale={baseLocale}
            commune={commune}
            handleSync={handlePublication}
            togglePause={
              baseLocale.sync.isPaused ? handleResumeSync : handlePause
            }
          />
        ) : (
          baseLocale.status === ExtendedBaseLocaleDTO.status.DRAFT && (
            <Button
              marginRight={8}
              height={24}
              appearance="primary"
              onClick={handleHabilitation}
            >
              Publier
            </Button>
          )
        ))}
    </>
  );
}

export default BALStatus;
