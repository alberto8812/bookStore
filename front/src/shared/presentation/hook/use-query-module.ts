

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import type { PaginatedResponse } from "@/shared/domain/base/base-entity.types";
import type { CursorPaginationParams } from "@/shared/domain/base/base-repository.interface";
import { useToast } from "./use-toast";

interface CursorPaginationState {
  limit: number;
  startCursor?: string | null;
  endCursor?: string | null;
}

interface PaginatedActions<T> {
  findAllPaginated: (params: CursorPaginationParams) => Promise<PaginatedResponse<T>>;
  findById: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export function useQueryModule<T>(queryKey: string, actions: PaginatedActions<T>, params?: { id?: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [pagination, setPagination] = useState<CursorPaginationState>({
    limit: 10,
    startCursor: null,
    endCursor: null,
  });

  const handleError = (error: unknown) => {
    const message = error instanceof Error ? error.message : "Error desconocido";
    toast.error(message);
  };

  const { data, isLoading } = useQuery<T | PaginatedResponse<T>>({
    queryKey: params?.id ? [queryKey, params.id] : [queryKey, pagination],
    queryFn: () =>
      params?.id
        ? actions.findById(params.id)
        : actions.findAllPaginated({
          limit: pagination.limit,
          afterCursor: pagination.startCursor,
          beforeCursor: pagination.endCursor,
        }),
    placeholderData: keepPreviousData,
  });


  const createMutation = useMutation({
    mutationFn: (newData: Partial<T>) => actions.create(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Registro creado correctamente.");
    },
    onError: handleError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data: updateData }: { id: string; data: Partial<T> }) =>
      actions.update(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Registro actualizado correctamente.");
    },
    onError: handleError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => actions.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success("Registro eliminado correctamente.");
    },
    onError: handleError,
  });

  return {
    data,
    isLoading,
    pagination,
    setPagination,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
