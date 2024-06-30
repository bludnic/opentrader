/**
 * Copyright 2024 bludnic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Repository URL: https://github.com/bludnic/opentrader
 */
import type { BotTemplate } from "@opentrader/bot-processor";
import * as templates from "./templates/index.js";

export * from "./templates/index.js";

export function findTemplate(template: string): BotTemplate<any> {
  if (template in templates) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return -- not typed
    return (templates as any)[template];
  }

  throw new Error(
    `Template ${template} not found. Ensure that the "${template}.ts" file exists in @opentrader/bot-templates`,
  );
}

export { templates };
