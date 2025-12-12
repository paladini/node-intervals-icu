# Prompt para Melhorar intervals-icu - Adicionar Campo `type` em Events

## 🎯 Objetivo

Adicionar suporte ao campo `type` na interface `Event` da biblioteca `intervals-icu` para permitir que consumidores diferenciem entre diferentes tipos de eventos (Run, Ride, Swim, etc.) sem depender de padrões de nome frágeis.

---

## 📋 Problema Identificado

### Situação Atual

A interface `Event` retornada por `getEvents()` não inclui o campo `type`, impossibilitando a diferenciação confiável entre tipos de eventos.

### Impacto

Consumidores da biblioteca precisam usar pattern matching no campo `name` como fallback:

```typescript
// ❌ FRÁGIL - Depende do nome do evento
const isRun = event.name?.toLowerCase().includes('run');
```

Isso é:
- **Não-confiável**: Nomes podem variar
- **Intrusivo**: Expõe lógica de negócio no cliente
- **Não-escalável**: Diferentes idiomas quebram o padrão

### Contexto

A API do Intervals.icu retorna o campo `type` em eventos, mas a biblioteca TypeScript não expõe esse campo na interface `Event`.

---

## ✅ Requisitos de Implementação

### 1. Atualizar Interface `Event`

**Local**: `src/types.ts` (ou arquivo equivalente que define interfaces)

**Mudança necessária**:

```typescript
/**
 * Event/Calendar entry
 */
interface Event {
    id?: number;
    athlete_id?: string;
    start_date_local: string;
    category?: string;
    type?: string;  // ← ADICIONAR: Tipo de evento (Run, Ride, Swim, etc)
    name?: string;
    description?: string;
    color?: string;
    show_as_note?: boolean;
    created?: string;
    updated?: string;
}
```

### 2. Documentar Valores Esperados para `type`

O campo `type` deve suportar os valores retornados pela API do Intervals.icu:

```typescript
/**
 * Type of event
 * Possible values:
 * - 'Run': Corrida
 * - 'Ride': Passeio de bicicleta / Ciclismo
 * - 'Swim': Natação
 * - 'Strength': Treinamento de força
 * - 'Other': Outro tipo
 */
type?: string;
```

### 3. Verificar Implementação em `client.ts`

**Local**: Arquivo que implementa `getEvents()`

**Verificar**:
1. A requisição para `/athlete/{id}/events` está sendo feita corretamente
2. A resposta está sendo serializada com todos os campos
3. O campo `type` está sendo mapeado para a interface `Event`

**Exemplo esperado**:

```typescript
async getEvents(options?: PaginationOptions, athleteId?: string): Promise<Event[]> {
  const endpoint = `/athlete/${athleteId || this.athleteId}/events`;
  const response = await this.request(endpoint, { params: options });
  // Garantir que 'type' está incluído na resposta
  return response.data;
}
```

### 4. Adicionar Testes Unitários

**Local**: `tests/` ou `__tests__/`

**Criar testes para validar**:

```typescript
describe('IntervalsClient - getEvents', () => {
  it('should return events with type field', async () => {
    const client = new IntervalsClient({
      apiKey: 'test-key',
      athleteId: 'test-id'
    });

    // Mock da resposta da API
    const mockEvents = [
      {
        id: 1,
        athlete_id: 'test-id',
        start_date_local: '2024-01-15',
        category: 'WORKOUT',
        type: 'Run',  // ← Campo crítico
        name: 'Morning Run',
        description: 'Easy 10k run'
      },
      {
        id: 2,
        athlete_id: 'test-id',
        start_date_local: '2024-01-16',
        category: 'WORKOUT',
        type: 'Ride',  // ← Campo crítico
        name: 'Afternoon Ride',
        description: 'Tempo intervals'
      }
    ];

    // Mock axios ou fetch
    // ... setup mock ...

    const events = await client.getEvents({
      oldest: '2024-01-01',
      newest: '2024-01-31'
    });

    // Validações
    expect(events).toHaveLength(2);
    expect(events[0]).toHaveProperty('type');
    expect(events[0].type).toBe('Run');
    expect(events[1].type).toBe('Ride');
  });

  it('should filter events by type', async () => {
    const client = new IntervalsClient({
      apiKey: 'test-key',
      athleteId: 'test-id'
    });

    const events = await client.getEvents({
      oldest: '2024-01-01',
      newest: '2024-01-31'
    });

    const runEvents = events.filter(e => e.type === 'Run');
    const rideEvents = events.filter(e => e.type === 'Ride');

    expect(runEvents.length + rideEvents.length).toBeLessThanOrEqual(events.length);
  });
});
```

### 5. Atualizar Documentação README

**Adicionar seção de uso**:

```markdown
### Filtrando eventos por tipo

```typescript
const client = new IntervalsClient({ apiKey: 'your-key' });

// Obter todos os eventos
const allEvents = await client.getEvents({
  oldest: '2024-01-01',
  newest: '2024-12-31'
});

// Filtrar apenas corridas
const runEvents = allEvents.filter(event => event.type === 'Run');

// Filtrar apenas ciclismo
const rideEvents = allEvents.filter(event => event.type === 'Ride');

// Filtrar apenas treinos de força
const strengthEvents = allEvents.filter(event => event.type === 'Strength');
```
```

---

## 📁 Arquivos a Modificar

```
intervals-icu/
├── src/
│   ├── types.ts              # ← Adicionar 'type' ao Event
│   ├── client.ts             # ← Verificar getEvents()
│   └── ...
├── tests/
│   └── getEvents.test.ts      # ← Adicionar testes
├── README.md                  # ← Atualizar documentação
└── package.json               # ← Verificar versão
```

---

## 🔍 Checklist de Implementação

- [ ] Adicionar campo `type?: string` à interface `Event` em `src/types.ts`
- [ ] Documentar valores esperados para `type` (Run, Ride, Swim, Strength, Other)
- [ ] Verificar que `getEvents()` retorna o campo `type` corretamente
- [ ] Criar testes unitários que validem a presença e valores de `type`
- [ ] Atualizar README.md com exemplo de filtro por tipo
- [ ] Testar com dados reais da API do Intervals.icu
- [ ] Validar que mudança é backward-compatible (campo é optional)
- [ ] Bumpar versão minor (x.Y.0) no package.json
- [ ] Atualizar CHANGELOG.md com a mudança

---

## 🧪 Teste de Validação

Após implementar, o código do consumidor deve funcionar assim:

```typescript
import { IntervalsClient } from 'intervals-icu';

const client = new IntervalsClient({
  apiKey: process.env.INTERVALS_API_KEY,
  athleteId: process.env.INTERVALS_ATHLETE_ID
});

// Obter workouts de hoje
const today = new Date().toISOString().split('T')[0];
const events = await client.getEvents({
  oldest: today,
  newest: today
});

// Filtrar com confiança
const runWorkout = events.find(e => 
  e.category === 'WORKOUT' && e.type === 'Run'
);

if (runWorkout) {
  console.log(`Found running workout: ${runWorkout.name}`);
  const pace = extractTargetPace(runWorkout.description);
  // ... aplicar lógica de ajuste de pace ...
}
```

---

## 📊 Impacto Esperado

| Antes | Depois |
|-------|--------|
| Dependência de pattern matching | Tipagem confiável |
| Frágil a mudanças de nome | Robusto e idioma-agnóstico |
| Sem suporte a múltiplos idiomas | Suporta qualquer idioma |
| Lógica complexa em consumidores | Lógica simples e clara |

---

## 🚀 Prioridade

**ALTA** - Bloqueia casos de uso reais que dependem de tipagem confiável de eventos (ex: weather-adjusted-pace).

---

## 📞 Informações de Contato

**Requisitante**: Consumidor real da biblioteca (weather-adjusted-pace)
**Repositório**: https://github.com/paladini/intervals-icu
**Referência**: https://github.com/paladini/intervals-weather-adjuster

---

## 📝 Notas Adicionais

1. **Backward Compatibility**: Como `type?` é um campo optional, essa mudança não quebra código existente.

2. **Validação de Valores**: Considerar usar um enum ou type union no futuro:
   ```typescript
   type EventType = 'Run' | 'Ride' | 'Swim' | 'Strength' | 'Other';
   type?: EventType;
   ```

3. **Documentação da API**: Verificar https://intervals.icu/api/v1/docs para confirmar os valores exatos que a API retorna.

4. **Casos de Teste**: Incluir testes com eventos em diferentes idiomas (PT-BR, EN, ES) para garantir robustez.
