<template>
  <div class="job-offer-input-container h-full">
    <UCard class="mb-6 h-full flex flex-col">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-document-text"
            class="text-primary text-2xl"
          />
          <h3 class="text-lg font-semibold">Job Offer Input</h3>
        </div>
      </template>

      <div class="space-y-4 flex-1 flex flex-col">
        <!-- Text Area Input -->
        <UFormField
          label="Paste Job Offer"
          description="Paste the job offer text below "
          class="flex-1 flex flex-col"
        >
          <!-- outer wrapper provides top/bottom inset so the native scrollbar doesn't touch rounded corners -->
          <div class="textarea-outer flex-1">
            <UTextarea
              v-model="jobOfferText"
              placeholder="Paste the job offer description here..."
              :rows="4"
              :maxrows="10"
              class="job-offer-input flex-1"
              :disabled="disabled"
              autoresize
            />
          </div>
        </UFormField>

        <!-- Character & Word Count -->
        <div class="text-sm text-gray-500 text-right">
          {{ jobOfferText.length }}
          characters,
          {{
            jobOfferText.split(/\s+/).filter((word) => word.length > 0).length
          }}
          words
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  disabled?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<Emits>();

const jobOfferText = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});

// Development default text
onMounted(() => {
  if (import.meta.env.MODE === "development") {
    jobOfferText.value = `Job Title: Machine Learning Engineer - Generative AI
Company: AetherAI Labs
Location: Luxembourg City, Luxembourg (Hybrid)
Employment Type: Full-time
Salary: €70,000-€85,000/year + performance bonus
Start Date: November 2025

Job Description:
AetherAI Labs is looking for a Machine Learning Engineer specialized in generative AI to help us build next-gen LLM-powered applications. You'll work on fine-tuning models, optimizing inference pipelines, and deploying scalable AI solutions in production.

Responsibilities:

Design, train, and fine-tune large language models and multimodal AI systems.

Implement prompt engineering and retrieval-augmented generation (RAG) pipelines.

Collaborate with data engineers to build and maintain clean datasets.

Optimize inference for latency and cost across cloud and on-premise environments.

Contribute to AI safety, evaluation, and monitoring frameworks.

Requirements:

2-4 years of experience in machine learning, with at least 1 year in LLMs or generative AI.

Strong Python skills (PyTorch, TensorFlow, Hugging Face).

Familiarity with MLOps tools (MLflow, Weights & Biases, Docker, Kubernetes).

Understanding of vector databases (Pinecone, Weaviate, FAISS).

Master's in Computer Science, Data Science, or related field (PhD a plus).

Benefits:

Competitive salary with annual bonus.

Health and wellness package, meal vouchers.

Budget for GPU cloud credits and research.

Opportunity to publish research and attend top AI conferences (NeurIPS, ICLR).

Startup-like environment with the stability of a scale-up.

How to Apply:
Apply via our careers page: careers.aetherai.fake
`;
  }
});
</script>

<style lang="scss" scoped>
.job-offer-input {
  width: 100%;
  margin: 16px 0;
}
</style>
